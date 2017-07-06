<script>
    export default {
        props: {
            items: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            clickItem(item){
                if( !item.disabled ){
                    this.$emit('click-item', item);
                    item.action();
                }
            }
        },
        computed: {
            pItems(){
                let ret = [];
                this.items.forEach( (value, index)=>{
                    value = typeof value != 'object' || value === null? {text: value}: value;
                    ret.push(Object.assign(value, {
                        index: value.index || index,
                        key: value.key || value.text || value,
                        icon: value.icon || false,
                        text: value.text || value,
                        disabled: value.disabled || false,
                        selected: value.selected || false,
                        highlighted: value.highlighted || false,
                        action: value.action || new Function()
                    }));
                });
                return ret;
            }
        }
    }
</script>

<template lang="pug">
    ul(class="fv-list",
        @click="$emit('click', $event)"
    )
        li(class="fv-item",
            v-for="item in pItems",
            :class="{'disabled': item.disabled, 'selected': item.selected, 'highlighted': item.highlighted}",
            @click="clickItem(item)"
        )
            i(v-if="item.icon",
                :class="item.icon"
            )
            =" "
            span(v-html="item.text")
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-list{
        border: solid 1px $shadow-color;
        &.no-outline-border{
            border: none;
        }
        & .fv-item{
            overflow: hidden;
            padding: $padding-small $padding;
            border-bottom: solid 1px $shadow-color-light;
            cursor: pointer;
            &:last-child{
                border-bottom: 0;
            }
            &.disabled{
                color: $gray-color-dark;
                cursor: not-allowed;
            }
            &.highlighted, &:active:not(.disabled){
                background: $shadow-color-light;
            }
            &.selected{
                background: $theme-color;
                color: yiq;
                &:active,
                &.fv-highlighted{
                    background: $theme-color-dark;
                }
            }
        }
    }
</style>