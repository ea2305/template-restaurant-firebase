<template>
  <main>
    <nuxt-link to="/dishes">back</nuxt-link>
    <br>
    make dish
    <hr>

    <!-- Template Form -->
    <h1>Form Dish</h1>
    <input type="text" v-model="name" max="100">
    <br>
    <input type="text" v-model="description" max="500">
    <br>
    <input type="number" v-model="price" min="1">
    <br>
    <image-picker @changeImage="setImage" />
    <br>
    <button @click="send">Insert</button>
    
    <p>{{ (isLoading) ? 'Loading' : '' }}</p>
  </main>
</template>

<script>
// Schema
import dishScheme from '~/scheme/dish'

// Components
import imagePicker from '~/components/imagePicker'

export default {
  asyncData ({ app }) {
    return dishScheme
  },
  data: () => ({ 
    file: null,
    isLoading: false
  }),
  methods: {
    /**
     * Insert Form
     */
    async send () {
      // Way to save
      // image store
      this.isLoading = true
      this.image = await this.storeImage()
      
      // Data package
      let data = {}
      for (const key in dishScheme) {
        data[key] = this._data[key]
      }

      // prepare data and send
      this.$firebase
          .database()
          .ref(`${process.env.APP_NAME}/dishes`)
          .push(data)
      this.isLoading = false
      this.$router.go(-1)
    },
    /**
     * Make Dish Persistence with img in FB
     */
    storeImage () {
      let vm = this
      return new Promise(function(resolve, reject) {
        if (vm.file === null) {
          resolve(null)
        }
        // data reference
        vm.path = `/images/dishes/${Date.now()}.${vm.file.type.split('/')[1]}`

        // filestore
        let ref = vm.$firebase.storage().ref()
        let uploadTask = ref.child(vm.path).put(vm.file)

        uploadTask.on(
            'state_changed', 
            function(snapshot) {}, 
            function(error) { reject(error); }, 
            function() { resolve(uploadTask.snapshot.downloadURL); }
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

