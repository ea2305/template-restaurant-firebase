<template>
  <main>
    <nuxt-link to="/dishes">back</nuxt-link>
    <br>
    edit dish
    <hr>
    <label for="">form</label>
    <input type="text" v-model="name" max="100">
    <br>
    <input type="text" v-model="description" max="500">
    <br>
    <input type="number" v-model="price" min="1">
    <br>
    <input type="text" v-model="image">
    <br>
    <button @click="update">Update</button>
  </main>
</template>

<script>

/**
 * Basic schema
 * <code lang="js">
    {
      name: 'Platillo sin nombre',
      description: 'Sin descripción',
      price: 20,
      coin: 'MXN',
      image: 'http://lorempixel.com/400/200/food/1'
    }
 * </code>
 */
import dishScheme from '~/scheme/dish'

export default {
  /**
   * Set data context
   * @param {Object} app
   */
  asyncData ({ app }) {
    return dishScheme
  },
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
    }
  }
}
</script>

