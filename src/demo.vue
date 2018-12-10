<template>
  <p>{{text}}</p>
</template>

<script>
module.exports = {
  props: ['text'],
  data: function() {
    return {};
  }
};
</script>

<style>
p {
  font-size: 40px;
  line-height: 50px;
}
</style>