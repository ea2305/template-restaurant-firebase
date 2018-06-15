<template>
  <main>
    <nuxt-link to="/">home</nuxt-link>
    <br>
    <nuxt-link to="/dishes/make">make</nuxt-link>
    <br>
    dishes

    <br>
    
    <!-- Show -->
    <section>
      <div v-for="item of dishes" :key="item.id" style="border: solid 1px black; margin: 1em;">
        <figure>
          <img :src="item.image" alt="" height="100" width="200">
        </figure>
        <p>{{ item.name }} | {{ item.description }} | {{ item.price }} </p>
        <p>{{ item.created_at }}</p>
        <nuxt-link :to="`/dishes/${item.id}/edit`">Edit</nuxt-link> | 
        <nuxt-link :to="`/dishes/${item.id}/delete`">Delete</nuxt-link>
      </div>
    </section>
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
import { objectToArray } from '~/libs/firebaseTools'

export default {
  data: () => ({
    dishes: []
  }),
  mounted () {
    // get data from firebase
    let fbRef = this.$firebase.database().ref(`${process.env.APP_NAME}/dishes`);
    // set to state
    fbRef.on('value', (snapshot) => {
      // set firebase object to get collection
      let fbObject = snapshot.val()
      this.dishes = objectToArray(fbObject)
    })
  }
}
</script>

