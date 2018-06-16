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
    <image-picker :src="image" :height="100" :width="200" @changeImage="setImage"/>
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
    async update () {
      // get id
      const id = this.$route.params.id

      this.isLoading = true
      this.image = await this.storeImage()

      if (this.path != null) {
        let ref = this.$firebase.storage().ref()
        // Create a reference to the file to delete
        var desertRef = ref.child(this.path)

        // Delete the file
        desertRef.delete().then(() => {
          this.isLoading = false
        }).catch((error) => {
          console.log(error)
          this.isLoading = false
        })
      }

      // data package
      let updates = {}
      let content = {}
      for (const key in dishScheme) {
        console.log(this._data[key], 'key: ', key)
        content[key] = this._data[key]
      }
      // prepare package
      updates[`${process.env.APP_NAME}/dishes/${id}`] = content
      // insert
      this.$firebase.database().ref().update(updates)
      this.isLoading = false
      // redirect
      this.$router.go(-1)
    },
    /**
     * Make Dish Persistence with img in FB
     */
    storeImage () {
      let vm = this
      return new Promise(function(resolve, reject) {
        if (vm.file === null) {
          vm.path = 'none'
          resolve(vm.image)
        }
        // data reference
        vm.path = `/images/dishes/${Date.now()}.${vm.file.type.split('/')[1]}`

        // filestore
        let ref = vm.$firebase.storage().ref()
        let uploadTask = ref.child(vm.path).put(vm.file)

        uploadTask.on(
            'state_changed',
            function(snapshot) {},
            function(error) { reject(error) },
            function() { resolve(uploadTask.snapshot.downloadURL) }
        )
      })
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

