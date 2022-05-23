<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门会议</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 头部警告区域 -->
      <el-alert show-icon :closable="false" title="注意：只有通过审批的会议才会加入到历史会议中！" type="warning"></el-alert>
      <el-select v-model="value" placeholder="请选择部门" @change="selectDept(value)">
        <el-option v-for="item in deptList" :key="item.deptNo" :label="item.deptName" :value="item.deptNo"></el-option>
      </el-select>

      <!-- tab标签页 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="已进行的会议" name="done">
          <el-table :data="DoneListDis" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="申请部门" prop="deptName" width="85"></el-table-column>
            <el-table-column label="会议室" prop="roomNo"></el-table-column>
            <el-table-column label="参会人数" prop="meetingSize"></el-table-column>
            <el-table-column label="会议主题" prop="meetingTheme"></el-table-column>
            <el-table-column label="开会日期">
              <template slot-scope="scope">
                <div>{{ $moment(scope.row.meetingDate).format('YYYY/MM/DD') }}</div>
              </template>
            </el-table-column>
            <el-table-column label="开会时间">
              <template slot-scope="scope">
                <div v-if="scope.row.meetingSlot == 1">9:00-10:30</div>
                <div v-if="scope.row.meetingSlot == 2">10:30-12:00</div>
                <div v-if="scope.row.meetingSlot == 3">13:00-15:00</div>
                <div v-if="scope.row.meetingSlot == 4">15:00-17:00</div>
                <div v-if="scope.row.meetingSlot == 5">17:00-19:00</div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <el-pagination
          @size-change="handleSizeChangeDone"
          @current-change="handleCurrentChangeDone"
          :current-page="queryDone.currentPage"
          :page-sizes="[2, 4, 8, 10]"
          :page-size="queryDone.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="doneTotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="未进行的会议" name="notdone">
          <el-table :data="NotDoneListDis" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="申请部门" prop="deptName" width="85"></el-table-column>
            <el-table-column label="会议室" prop="roomNo"></el-table-column>
            <el-table-column label="参会人数" prop="meetingSize"></el-table-column>
            <el-table-column label="会议主题" prop="meetingTheme"></el-table-column>
            <el-table-column label="开会日期">
              <template slot-scope="scope">
                <div>{{ $moment(scope.row.meetingDate).format('YYYY/MM/DD') }}</div>
              </template>
            </el-table-column>
            <el-table-column label="开会时间">
              <template slot-scope="scope">
                <div v-if="scope.row.meetingSlot == 1">9:00-10:30</div>
                <div v-if="scope.row.meetingSlot == 2">10:30-12:00</div>
                <div v-if="scope.row.meetingSlot == 3">13:00-15:00</div>
                <div v-if="scope.row.meetingSlot == 4">15:00-17:00</div>
                <div v-if="scope.row.meetingSlot == 5">17:00-19:00</div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <el-pagination
          @size-change="handleSizeChangeNotDone"
          @current-change="handleCurrentChangeNotDone"
          :current-page="queryNotDone.currentPage"
          :page-sizes="[2, 4, 8, 10]"
          :page-size="queryNotDone.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="notDoneTotal">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      deptList: [
        { deptNo: 'CT01', deptName: '主管部门', deptPhone: 18313217184 },
        { deptNo: 'CT02', deptName: 'HR', deptPhone: 18312347195 },
        { deptNo: 'CT03', deptName: '财务', deptPhone: 18314534718 },
        { deptNo: 'CT11', deptName: '开发部01', deptPhone: 18312347324 },
        { deptNo: 'CT12', deptName: '开发部02', deptPhone: 18364347184 },
        { deptNo: 'CT21', deptName: '开发部03', deptPhone: 18312347175 },
        { deptNo: 'CT22', deptName: '开发部04', deptPhone: 18312365184 },
        { deptNo: 'CT31', deptName: '支持部门', deptPhone: 18312347126 }
      ],
      meetingList: [
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '101', meetingSize: '35', meetingTheme: '开发流程改善', meetingDate: '2021-10-21', meetingSlot: 3 },
        { deptNo: 'CT02', deptName: 'HR', roomNo: '108', meetingSize: '3', meetingTheme: '面试会议', meetingDate: '2021-7-1', meetingSlot: 1 },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '102', meetingSize: '20', meetingTheme: '开发经验分享', meetingDate: '2021-9-17', meetingSlot: 2 },
        { deptNo: 'CT01', deptName: '主管部门', roomNo: '105', meetingSize: '5', meetingTheme: '年度事项管理', meetingDate: '2021-10-1', meetingSlot: 4 },
        { deptNo: 'CT03', deptName: '财务', roomNo: '103', meetingSize: '18', meetingTheme: '年度财务汇总', meetingDate: '2021-12-25', meetingSlot: 2 },
        { deptNo: 'CT11', deptName: '开发部01', roomNo: '102', meetingSize: '25', meetingTheme: '工作进展汇报', meetingDate: '2021-11-7', meetingSlot: 5 },
        { deptNo: 'CT12', deptName: '开发部02', roomNo: '104', meetingSize: '15', meetingTheme: '周报', meetingDate: '2022-3-8', meetingSlot: 3 },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '107', meetingSize: '5', meetingTheme: '自动化测试', meetingDate: '2022-7-8', meetingSlot: 4 },
        { deptNo: 'CT31', deptName: '支持部门', roomNo: '108', meetingSize: '3', meetingTheme: '自动化工具开发', meetingDate: '2022-10-1', meetingSlot: 2 },
        { deptNo: 'CT01', deptName: '主管部门', roomNo: '109', meetingSize: '2', meetingTheme: '项目交接', meetingDate: '2022-12-11', meetingSlot: 1 },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '103', meetingSize: '20', meetingTheme: '周报', meetingDate: '2022-2-21', meetingSlot: 3 },
        { deptNo: 'CT02', deptName: 'HR', roomNo: '109', meetingSize: '2', meetingTheme: '新人培训', meetingDate: '2022-7-8', meetingSlot: 4 },
        { deptNo: 'CT11', deptName: '开发部01', roomNo: '102', meetingSize: '18', meetingTheme: '项目管理', meetingDate: '2022-8-1', meetingSlot: 4 },
        { deptNo: 'CT12', deptName: '开发部02', roomNo: '101', meetingSize: '28', meetingTheme: '项目经验分享', meetingDate: '2022-7-22', meetingSlot: 2 },
        { deptNo: 'CT03', deptName: '财务', roomNo: '108', meetingSize: '3', meetingTheme: '薪资考核', meetingDate: '2022-7-5', meetingSlot: 2 }
      ],
      value: '',
      DoneList: [],
      NotDoneList: [],
      deptMeetingList: [],
      activeName: 'done',
      queryDone: {
        pageSize: 4,
        currentPage: 1,
        pass: 1
      },
      queryNotDone: {
        pageSize: 4,
        currentPage: 1,
        pass: 0
      }
    }
  },
  computed: {
    doneTotal () {
      return this.DoneList.length
    },
    notDoneTotal () {
      return this.NotDoneList.length
    },
    DoneListDis () {
      return this.DoneList.slice(
        (this.queryDone.currentPage - 1) * this.queryDone.pageSize,
        this.queryDone.currentPage * this.queryDone.pageSize
      )
    },
    NotDoneListDis () {
      return this.NotDoneList.slice(
        (this.queryNotDone.currentPage - 1) * this.queryNotDone.pageSize,
        this.queryNotDone.currentPage * this.queryNotDone.pageSize
      )
    }
  },
  methods: {
    selectDept (id) {
      const timeNow = new Date()
      this.queryDone.deptNo = id
      this.queryNotDone.deptNo = id
      // 获取部门会议列表
      this.deptMeetingList = this.meetingList.filter(item => item.deptNo === id)
      this.DoneList = this.deptMeetingList.filter(item => this.$moment(item.meetingDate).isBefore(timeNow))
      this.NotDoneList = this.deptMeetingList.filter(item => this.$moment(item.meetingDate).isAfter(timeNow))
      if (this.DoneList.length === 0 && this.NotDoneList.length === 0) {
        return this.$message.error('获取历史会议列表失败！没有找到该部门会议记录')
      }
      this.$message.success('获取部门历史会议列表成功！')
      this.activeName = 'done'
    },
    handleSizeChangeDone (newSize) {
      this.queryDone.pageSize = newSize
    },
    handleCurrentChangeDone (newPage) {
      this.queryDone.currentPage = newPage
    },
    handleSizeChangeNotDone (newSize) {
      this.queryNotDone.pageSize = newSize
    },
    handleCurrentChangeNotDone (newPage) {
      this.queryNotDone.currentPage = newPage
    }
  }
}
</script>

<style scoped>
  .el-select {
    margin-top: 15px;
  }

  .el-tabs {
    margin-top: 15px;
  }
</style>
