<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>会议室管理</el-breadcrumb-item>
      <el-breadcrumb-item>会议室预定</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-form ref="form" :model="selectedInfo" label-width="100px">
        <el-form-item label="会议室：" size="mini" :disabled="!selectedInfo.roomStatus">
          <el-select v-model="selectedInfo.roomNo" placeholder="请选择会议室" prop="roomNo" @change="roomSelectCb">
            <el-option v-for="room in roomList" :key="room.roomNo" :label="room.roomNo" :value="room.roomNo"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议室状态：" size="mini" prop="roomStatus">
          <div class="tag">
            <el-tag type="success" v-if="selectedInfo.roomStatus === true">可用</el-tag>
            <el-tag type="danger" v-else-if="selectedInfo.roomStatus === false">不可用</el-tag>
            <el-tag type="info" v-else>状态未知</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="开会日期：" size="mini" prop="meetingDate">
          <el-date-picker v-model="selectedInfo.meetingDate" type="date" placeholder="选择一个日期" :disabled="!selectedInfo.roomStatus"/>
        </el-form-item>
        <el-form-item label="开会时间：" size="mini" prop="meetingSlot">
          <el-time-picker v-model="selectedInfo.meetingSlot" is-range arrow-control range-separator="To" start-placeholder="Start time" end-placeholder="End time" :disabled="!selectedInfo.roomStatus"/>
        </el-form-item>
        <el-form-item label="会议主题：" prop="meetingTheme">
          <el-input type="textarea" placeholder="请输入会议主题，不超过15个字符。" v-model="selectedInfo.meetingTheme" :disabled="!selectedInfo.roomStatus"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" :disabled="!selectedInfo.roomStatus">提交申请</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedInfo: {
        roomNo: '',
        roomStatus: '',
        meetingDate: '',
        meetingSlot: '',
        meetingTheme: ''
      },
      roomList: [
        { roomNo: '101', roomSize: 50, roomStatus: true },
        { roomNo: '102', roomSize: 20, roomStatus: false },
        { roomNo: '103', roomSize: 20, roomStatus: true },
        { roomNo: '104', roomSize: 10, roomStatus: true },
        { roomNo: '105', roomSize: 10, roomStatus: false },
        { roomNo: '106', roomSize: 10, roomStatus: true },
        { roomNo: '107', roomSize: 5, roomStatus: true },
        { roomNo: '108', roomSize: 5, roomStatus: false },
        { roomNo: '109', roomSize: 3, roomStatus: false }
      ]
    }
  },
  methods: {
    roomSelectCb () {
      this.selectedInfo.meetingDate = ''
      this.selectedInfo.meetingSlot = ''
      this.selectedInfo.meetingTheme = ''
      const room = this.roomList.find(item => item.roomNo === this.selectedInfo.roomNo)
      this.selectedInfo.roomStatus = room.roomStatus
      if (!room.roomStatus) {
        this.$message.error('该会议室目前不可用！请重新选择')
      }
    },

    submit () {
      // 发送会议室预定信息给服务器
      this.selectedInfo.roomNo = ''
      this.selectedInfo.roomStatus = ''
      this.selectedInfo.meetingDate = ''
      this.selectedInfo.meetingSlot = ''
      this.selectedInfo.meetingTheme = ''
      return this.$message.success('申请成功，请等待管理员审核！')
    }
  }
}
</script>

<style lang="less" scoped>
    .tag {
      display: inline-block;
    }
    .el-form {
        width: 500px;
        margin: 25px auto;
    }
</style>
