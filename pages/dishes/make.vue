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
    <input type="file" @change="setImage"><br>
    <img src="" height="200" alt="Image preview...">
    <br>
    <button @click="send">Insert</button>
    
    <p>{{ (isLoading) ? 'Loading' : '' }}</p>
  </main>
</template>

<script>
// Schema
import dishScheme from '~/scheme/dish'

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
    send () {
      // Data package
      let data = {}
      for (const key in dishScheme) {
        data[key] = this._data[key]
      }

      // way to save
      if (this.file != null)
        this.storeWithImage(data)
      else
        this.store(data)
    },
    /**
     * Make Dish Persistence in FB
     * @param {Object} data
     */
    store (data) {
      // prepare data and send
      this.$firebase
          .database()
          .ref(`${process.env.APP_NAME}/dishes`)
          .push(data)
      
      this.$router.go(-1)
    },
    /**
     * Make Dish Persistence with img in FB
     * @param {Object} data
     */
    storeWithImage (data) {
      // loader
      this.isLoading = true
      // data reference
      data.path = `/images/dishes/${Date.now()}.${this.file.type.split('/')[1]}`

      // filestore
      let ref = this.$firebase.storage().ref()
      let upload = ref.child(data.path).put(this.file)


      // Listen for state changes, errors, and completion of the upload.
      upload.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, (error) => { 
        console.log(error)
        this.isLoading = false
      }, () => {
        // Handle successful uploads on complete
        upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
          data.image = downloadURL
          // prepare data and send
          this.$firebase
              .database()
              .ref(`${process.env.APP_NAME}/dishes`)
              .push(data)
          this.isLoading = false
          this.$router.go(-1)
        })
      })
    },
    /**
     * File reading
     */
    setImage() {
      let vm = this
      let preview = document.querySelector('img');
      let file = document.querySelector('input[type=file]').files[0];
      const reader = new FileReader();

      reader.addEventListener("load", function () {
        preview.src = reader.result;
      }, false)

      if (file) {
        this.file = file
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

