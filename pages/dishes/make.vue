<template>
  <main>
    <nuxt-link to="/dishes">back</nuxt-link>
    <br>
    make dish
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
    <button @click="send">Insert</button>
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
  asyncData ({ app }) {
    return dishScheme
  },
  mounted () {
    console.log(this.name)
  },
  methods: {
    /**
     * Insert Form
     */
    send () {
      let data = {}
      for (const key in dishScheme) {
        data[key] = this._data[key]
      }
      // set date
      data.created_at = this.$moment().format('YYYY-MM-DD')
      // prepare data and send
      this.$firebase
          .database()
          .ref(`${process.env.APP_NAME}/dishes`)
          .push(data)
      
      this.$router.go(-1)
    }
  }
}
</script>

