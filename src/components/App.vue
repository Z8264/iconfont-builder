<template>
  <div id="app">
    <h1>Shopping Cart Example</h1>
    <hr>
    <h2 @click="changeText">Products</h2>
    <ProductList v-bind:text="abc"/>
    <hr>
    <ShoppingCart/>
  </div>
</template>

<script>
import ProductList from "./ProductList.vue";
import ShoppingCart from "./ShoppingCart.vue";
export default {
  components: { ProductList, ShoppingCart },
  data: function() {
    return {
      abc: "123"
    };
  },
  methods:{
    changeText:function(){
      this.abc = '234';
    }
  },
  mounted:function(){
    setTimeout(()=>{
      this.abc = '123456789';
    },2000)
  }
};
</script>