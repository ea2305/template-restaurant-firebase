<template>
  <main>
    <nuxt-link to="/dishes">back</nuxt-link>
    <hr>
    <h1>Edit dish</h1>
    <br>

    <input type="text" v-model="name" max="100">
    <br>
    <input type="text" v-model="description" max="500">
    <br>
    <input type="number" v-model="price" min="1">
    <br>
    <image-picker :src="image" :height="100" :width="200" @change="setImage"/>
    <br>
    <button @click="update">Update</button>

    {{ (isLoading) ? 'Loading' : ''}}
  </main>
</template>

<script>
// Schema
import dishScheme from '~/scheme/dish'

// components
import imagePicker from '~/components/imagePicker'

export default {
  /**
   * Set data context
   * @param {Object} app
   */
  asyncData ({ app }) {
    return dishScheme
  },
  data: () => ({
    file: null,
    isLoading: false
  }),
  /**
   * Update data context with database info
   */
  async beforeMount () {
    let id = this.$route.params.id
    let snapshot = await this.$firebase.database()
      .ref(`${process.env.APP_NAME}/dishes/${id}`)
      .once('value')

    let data = snapshot.val()
    for (const key in dishScheme) {
      this._data[key] = data[key]
    }
  },
  methods: {
    /**
     * Update resource info
     */
    update () {
      // get id
      const id = this.$route.params.id
      // data package
      let updates = {}
      let content = {}
      for (const key in dishScheme) {
        content[key] = this._data[key]
      }
      // prepare package
      updates[`${process.env.APP_NAME}/dishes/${id}`] = content
      // insert
      this.$firebase.database().ref().update(updates)
      // redirect
      this.$router.go(-1)
    },
    /**
     * Set Blob file
     * @param {Blob} File
     */
    setImage (file) { this.file = file }
  },
  components: {
    imagePicker
  }
}
</script>

