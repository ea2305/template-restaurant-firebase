<template>
  <main>
    <nuxt-link to="/dishes">dishes</nuxt-link>

    <hr>
    <h1>Delete dish</h1>
    <p>{{ name }}</p>
    delete?
    <br>

    <button @click="deleteResource">yes</button>
    <br>
    <button @click="$router.go(-1)">No</button>

    <p>{{ (isLoading) ? 'Loading' : ''}}</p>

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
  data: () => ({
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
     * Delete especific resource
     */
    async deleteResource () {
      // id resource
      const id = this.$route.params.id
      this.isLoading = true

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

      // delete trigger
      let result = await this.$firebase.database()
        .ref(`${process.env.APP_NAME}/dishes/${id}`)
        .remove()
      // redirect
      this.$router.go(-1)
    }
  }
}
</script>

