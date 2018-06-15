<template>
  <div>
    <input type="file" @change="setImage"><br>
    <img :src="src" :height="height" :width="width" :alt="description">
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 100
    },
    width: {
      type: Number,
      default: 200
    },
    description: {
      type: String,
      default: 'preview'
    }
  },
  methods: {
    /**
     * File reading
     */
    setImage() {
      let preview = document.querySelector('img');
      let file = document.querySelector('input[type=file]').files[0];
      const reader = new FileReader();

      reader.addEventListener("load", function () {
        preview.src = reader.result;
      }, false)

      if (file) {
        this.$emit('changeImage', file)
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>
