<template>
  <nut-actionsheet :is-visible="isVisible" @close="closeActionSheet">
    <div class="nut-picker" slot="custom" :class="customClassName ? customClassName : null">
      <div class="close_div">×</div>
      <div class="sheet_body">
        <div class="tabFont" @click="handleTab(1)">
          <div :class="{titleClk:tabTitleY}" style="margin-bottom: 1vh">开始日期</div>
          <div :class="{subTitleClkY:tabSubTitleY}" style="">{{s_year}}-{{s_month}}-{{s_day}} {{s_hour}}:{{s_minite}}
          </div>
        </div>
        <div class="diver_div"></div>
        <div class="tabFont"
             @click="handleTab(0)">
          <div :class="{titleClk:!tabTitleY}" style="margin-bottom: 1vh">结束日期</div>
          <div :class="{subTitleClkY:!tabSubTitleY}">{{e_year}}-{{e_month}}-{{e_day}} {{e_hour}}:{{e_minite}}</div>
        </div>
      </div>
      <div class="nut-picker-panel panel_padding" v-show="isFirst">
        <template v-for="(item, index) of listData">
          <nut-picker-slot
            :ref="`picker-slot-${index}`"
            :default-value="chooseValueData[index]"
            :is-update="isUpdate"
            :list-data="item"
            @chooseItem="chooseItem"
            :key="index"
            :key-index="index"
          ></nut-picker-slot>
        </template>
      </div>
      <div class="nut-picker-panel panel_padding" v-show="!isFirst">
        <template v-for="(item, index) of listData">
          <nut-picker-slot
            :ref="`picker-slot-${index}`"
            :default-value="chooseValueDataE[index]"
            :is-update="isUpdate"
            :list-data="item"
            @chooseItem="chooseItemE"
            :key="index"
            :key-index="index"
          ></nut-picker-slot>
        </template>
      </div>
      <div class="btn_tools_div">
        <button class="cancle_btn">取消</button>
        <button @click="confirm()" class="ok_btn">确定</button>
      </div>
    </div>
  </nut-actionsheet>
</template>
<script>
  import nutactionsheet from '../actionsheet/actionsheet.vue';
  import nutpickerslot from './picker-slot.vue';
  import locale from '../mixins/locale';
  export default {
    name: 'nut-picker',
    mixins: [locale],
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      customClassName: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: ' '
      },
      listData: {
        type: Array,
        default: () => []
      },
      defaultValueData: {
        type: Array,
        default: () => []
      },
      defaultValueDataE: {
        type: Array,
        default: () => []
      }
    },
    components: {
      [nutactionsheet.name]: nutactionsheet,
      [nutpickerslot.name]: nutpickerslot
    },
    data() {
      return {
        chooseValueData: [],
        cacheValueData: [],

        chooseValueDataE: [],
        cacheValueDataE: [],

        isUpdate: false,
        s_year: '',
        s_month: '',
        s_day: '',
        s_hour: '',
        s_minite: '',
        e_year: '',
        e_month: '',
        e_day: '',
        e_hour: '',
        e_minite: '',
        isFirst: true,
        tabTitleY: true,
        tabSubTitleY: true,
        tabSubTitleN: false,
      };
    },
    watch: {
      defaultValueData: function () {
        this.chooseValueData = [...this.defaultValueData];
        this.cacheValueData = [...this.defaultValueData];
        this.$emit('confirm', this.cacheValueData);
      },
      defaultValueDataE: function () {
        this.chooseValueDataE = [...this.defaultValueDataE];
        this.cacheValueDataE = [...this.defaultValueDataE];
        this.$emit('confirm', this.cacheValueDataE);
      },
      listData: function () {
        this.init();
      }
    },

    methods: {
      updateChooseValue(self, index, value) {
        self.cacheValueData.splice(index, 1, value);
        let ref = `picker-slot-${index}`;
        self.$refs[ref] && self.$refs[ref][0].updateTransform(value);
      },

      handleTab(flog){
        if (flog) {
          this.isFirst = true;
          this.tabTitleY = true;
          this.tabSubTitleY = true;
        } else {
          this.isFirst = false;
          this.tabTitleY = false;
          this.tabSubTitleY = false;
        }
      },
      closeActionSheet() {
        this.isUpdate = !this.isUpdate;
        this.cacheValueData = [...this.chooseValueData];
        this.$emit('close');
        this.$emit('close-update', this, this.chooseValueData);
      },

      confirm() {
        let v = this.s_year + '-' + this.s_month + '-' + this.s_day + '-' + this.s_hour + '-' + this.s_minite + ',' + this.e_year + '-' + this.e_month + '-' + this.e_day + '-' + this.e_hour + '-' + this.e_minite;
        this.$emit('confirm', v);
        //this.$emit('confirm', this.cacheValueDataE);
        //  this.chooseValueData = [...this.cacheValueData];
        // this.$emit('close');
      },
      chooseItem(value, index) {
        if (this.cacheValueData[index] !== value) {
          this.cacheValueData[index] = value;
          this.handleStartDateTime(index);
          this.$emit('choose', this, index, value, this.cacheValueData);
        }
      },
      chooseItemE(value, index) {
        if (this.cacheValueDataE[index] !== value) {
          this.cacheValueDataE[index] = value;
          this.handleEndDateTime(index);
          this.$emit('choose', this, index, value, this.cacheValueData);
        }
      },
      handleFormatDateTime(str){
        return str.substr(0, str.length - 1) >= 10 ? str.substr(0, str.length - 1) : '0' + str.substr(0, str.length - 1);
      },
      handleEndDateTime(i){
        if (i == 0) {
          this.e_year = this.handleFormatDateTime(this.cacheValueDataE[0]);
        } else if (i == 1) {
          this.e_month = this.handleFormatDateTime(this.cacheValueDataE[1]);
        } else if (i == 2) {
          this.e_day = this.handleFormatDateTime(this.cacheValueDataE[2]);
        } else if (i == 3) {
          this.e_hour = this.handleFormatDateTime(this.cacheValueDataE[3]);
        } else if (i == 4) {
          this.e_minite = this.handleFormatDateTime(this.cacheValueDataE[4]);
        }
      },
      handleStartDateTime(i){
        if (i == 0) {
          this.s_year = this.handleFormatDateTime(this.cacheValueData[0]);
        } else if (i == 1) {
          this.s_month = this.handleFormatDateTime(this.cacheValueData[1]);
        } else if (i == 2) {
          this.s_day = this.handleFormatDateTime(this.cacheValueData[2]);
        } else if (i == 3) {
          this.s_hour = this.handleFormatDateTime(this.cacheValueData[3]);
        } else if (i == 4) {
          this.s_minite = this.handleFormatDateTime(this.cacheValueData[4]);
        }
      },
      init() {
        if (this.defaultValueData && this.defaultValueData.length) {
          this.chooseValueData = [...this.defaultValueData];
        } else {
          let defaultValueData = [];
          this.listData.map((item, index) => {
            defaultValueData.push(item[0]);
          });
          console.log(',,', defaultValueData)
          this.chooseValueData = [...defaultValueData];
        }

        if (this.defaultValueDataE && this.defaultValueDataE.length) {
          this.chooseValueDataE = [...this.defaultValueDataE];
        } else {
          let defaultValueDataE = [];
          this.listData.map((item, index) => {
            defaultValueDataE.push(item[0]);
          });
          console.log(',,', defaultValueDataE)
          this.chooseValueDataE = [...defaultValueDataE];
        }


      }
    },

    created() {
      this.init();
    }
  };
</script>
<style scoped="">
  /deep/
  .nut-picker-item {
    font-size: 5vw;
  }

  /deep/
  .nut-picker-roller-item {
    font-size: 4vw;
  }

  /deep/
  .nut-picker-list .nut-picker-indicator {
    border-top: 1px solid #F09D9D;
    border-bottom: 1px solid #F09D9D;
    background-color: #F0E0E0;
    opacity: 0.4;
  }

  .titleClk {
    color: #E13C3C;
  }

  .subTitleClkY {
    color: #2C3E55
  }

  .tabFont {
    flex-direction: column;
    text-align: left;
    font-size: 4.1vw;
    color: #B0B3C6;
    font-weight: 600;
  }

  .close_div {
    position: absolute;
    right: 3%;
    top: 2%;
    font-size: 8vw;
  }

  .sheet_body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10% 5% 0 5%
  }

  .diver_div {
    float: left;
    width: 1px;
    height: 40px;
    background: #ECECEC;
  }

  .panel_padding {
    padding: 0 5% 0 5%
  }

  .btn_tools_div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 5%;
  }

  .cancle_btn {
    width: 40%;
    border-radius: 10px;
    height: 5.5vh;
    font-size: 4vw;
    background-color: #FFFFFF;
    border: 1px solid #FFFFFF;
    color: #C0C3D3
  }

  .ok_btn {
    width: 40%;
    border-radius: 10px;
    height: 5.5vh;
    font-size: 4vw;
    background-color: #EA0D0D;
    border: 1px solid #EA0D0D;
    color: #FCE7E7
  }

  /deep/
  .nut-actionsheet-panel {
    border-radius: 25px 25px 0 0;

  }
</style>
