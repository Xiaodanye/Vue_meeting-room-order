<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>审批申请</el-breadcrumb-item>
      <el-breadcrumb-item>已审批</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="批准的审批" name="accept">
          <el-table :data="acceptListDis" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="申请部门" prop="deptName"></el-table-column>
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
            <el-table-column label="申请日期">
              <template slot-scope="scope">
                <div>{{ $moment(scope.row.meetingDate).subtract(3, 'days').format('YYYY/MM/DD') }}</div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <el-pagination
          @size-change="handleSizeChangeAccept"
          @current-change="handleCurrentChangeAccept"
          :current-page="acceptInfo.currentPage"
          :page-sizes="[5, 10]"
          :page-size="acceptInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="acceptTotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="拒绝的审批" name="reject">
          <el-table :data="rejectListDis" border stripe>
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
            <el-table-column label="申请日期">
              <template slot-scope="scope">
                <div>{{ $moment(scope.row.meetingDate).subtract(3, 'days').format('YYYY/MM/DD') }}</div>
              </template>
            </el-table-column>
            <el-table-column label="拒绝理由" prop="rejectReason"></el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <el-pagination
          @size-change="handleSizeChangeReject"
          @current-change="handleCurrentChangeReject"
          :current-page="rejectInfo.currentPage"
          :page-sizes="[5, 10]"
          :page-size="rejectInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="rejectTotal">
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
      activeName: 'accept',
      meetingList: [
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '101', meetingSize: '35', meetingTheme: '开发流程改善', meetingDate: '2021-10-21', meetingSlot: 3, approved: true },
        { deptNo: 'CT02', deptName: 'HR', roomNo: '108', meetingSize: '3', meetingTheme: '面试会议', meetingDate: '2021-7-1', meetingSlot: 1, approved: true },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '102', meetingSize: '20', meetingTheme: '开发经验分享', meetingDate: '2021-9-17', meetingSlot: 2, approved: true },
        { deptNo: 'CT01', deptName: '主管部门', roomNo: '105', meetingSize: '5', meetingTheme: '年度事项管理', meetingDate: '2021-10-1', meetingSlot: 4, approved: true },
        { deptNo: 'CT03', deptName: '财务', roomNo: '103', meetingSize: '18', meetingTheme: '年度财务汇总', meetingDate: '2021-12-25', meetingSlot: 2, approved: true },
        { deptNo: 'CT11', deptName: '开发部01', roomNo: '102', meetingSize: '25', meetingTheme: '工作进展汇报', meetingDate: '2021-11-7', meetingSlot: 5, approved: true },
        { deptNo: 'CT12', deptName: '开发部02', roomNo: '104', meetingSize: '15', meetingTheme: '周报', meetingDate: '2022-3-8', meetingSlot: 3, approved: true },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '107', meetingSize: '5', meetingTheme: '自动化测试', meetingDate: '2022-7-8', meetingSlot: 4, approved: true },
        { deptNo: 'CT31', deptName: '支持部门', roomNo: '108', meetingSize: '3', meetingTheme: '自动化工具开发', meetingDate: '2022-10-1', meetingSlot: 2, approved: true },
        { deptNo: 'CT01', deptName: '主管部门', roomNo: '109', meetingSize: '2', meetingTheme: '项目交接', meetingDate: '2022-12-11', meetingSlot: 1, approved: true },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '103', meetingSize: '20', meetingTheme: '周报', meetingDate: '2022-2-21', meetingSlot: 3, approved: true },
        { deptNo: 'CT02', deptName: 'HR', roomNo: '109', meetingSize: '2', meetingTheme: '新人培训', meetingDate: '2022-7-8', meetingSlot: 4, approved: true },
        { deptNo: 'CT11', deptName: '开发部01', roomNo: '102', meetingSize: '18', meetingTheme: '项目管理', meetingDate: '2022-8-1', meetingSlot: 4, approved: true },
        { deptNo: 'CT12', deptName: '开发部02', roomNo: '101', meetingSize: '28', meetingTheme: '项目经验分享', meetingDate: '2022-7-22', meetingSlot: 2, approved: true },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '101', meetingSize: '35', meetingTheme: '开发流程改善', meetingDate: '2021-10-21', meetingSlot: 3, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT02', deptName: 'HR', roomNo: '108', meetingSize: '3', meetingTheme: '面试会议', meetingDate: '2021-7-1', meetingSlot: 1, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '102', meetingSize: '20', meetingTheme: '开发经验分享', meetingDate: '2021-9-17', meetingSlot: 2, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT01', deptName: '主管部门', roomNo: '105', meetingSize: '5', meetingTheme: '年度事项管理', meetingDate: '2021-10-1', meetingSlot: 4, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT03', deptName: '财务', roomNo: '103', meetingSize: '18', meetingTheme: '年度财务汇总', meetingDate: '2021-12-25', meetingSlot: 2, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT11', deptName: '开发部01', roomNo: '102', meetingSize: '25', meetingTheme: '工作进展汇报', meetingDate: '2021-11-7', meetingSlot: 5, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT12', deptName: '开发部02', roomNo: '104', meetingSize: '15', meetingTheme: '周报', meetingDate: '2022-3-8', meetingSlot: 3, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '107', meetingSize: '5', meetingTheme: '自动化测试', meetingDate: '2022-7-8', meetingSlot: 4, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT31', deptName: '支持部门', roomNo: '108', meetingSize: '3', meetingTheme: '自动化工具开发', meetingDate: '2022-10-1', meetingSlot: 2, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT01', deptName: '主管部门', roomNo: '109', meetingSize: '2', meetingTheme: '项目交接', meetingDate: '2022-12-11', meetingSlot: 1, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT21', deptName: '开发部03', roomNo: '103', meetingSize: '20', meetingTheme: '周报', meetingDate: '2022-2-21', meetingSlot: 3, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT02', deptName: 'HR', roomNo: '109', meetingSize: '2', meetingTheme: '新人培训', meetingDate: '2022-7-8', meetingSlot: 4, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT11', deptName: '开发部01', roomNo: '102', meetingSize: '18', meetingTheme: '项目管理', meetingDate: '2022-8-1', meetingSlot: 4, approved: false, rejectReason: '不同意' },
        { deptNo: 'CT12', deptName: '开发部02', roomNo: '101', meetingSize: '28', meetingTheme: '项目经验分享', meetingDate: '2022-7-22', meetingSlot: 2, approved: false, rejectReason: '不同意' }
      ],
      acceptList: [],
      rejectList: [],
      acceptInfo: {
        auditStatus: 1,
        pageSize: 5,
        currentPage: 1
      },
      rejectInfo: {
        auditStatus: 2,
        pageSize: 5,
        currentPage: 1
      }
    }
  },
  created () {
    this.acceptList = this.meetingList.filter(item => item.approved)
    this.rejectList = this.meetingList.filter(item => !item.approved)
  },
  computed: {
    acceptTotal () {
      return this.acceptList.length
    },
    rejectTotal () {
      return this.rejectList.length
    },
    acceptListDis () {
      return this.acceptList.slice(
        (this.acceptInfo.currentPage - 1) * this.acceptInfo.pageSize,
        this.acceptInfo.currentPage * this.acceptInfo.pageSize
      )
    },
    rejectListDis () {
      return this.rejectList.slice(
        (this.rejectInfo.currentPage - 1) * this.rejectInfo.pageSize,
        this.rejectInfo.currentPage * this.rejectInfo.pageSize
      )
    }
  },
  methods: {
    handleSizeChangeAccept (newSize) {
      this.acceptInfo.pageSize = newSize
    },
    handleCurrentChangeAccept (newPage) {
      this.acceptInfo.currentPage = newPage
    },
    handleSizeChangeReject (newSize) {
      this.rejectInfo.pageSize = newSize
    },
    handleCurrentChangeReject (newPage) {
      this.rejectInfo.currentPage = newPage
    }
  }
}
</script>
