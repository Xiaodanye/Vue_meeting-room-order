<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>审批申请</el-breadcrumb-item>
      <el-breadcrumb-item>未审批</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="applcationListDis" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="申请部门" prop="deptName"></el-table-column>
        <el-table-column label="会议室" prop="roomNo"></el-table-column>
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
        <el-table-column label="申请时间">
          <template slot-scope="scope">
            <div>{{ $moment(scope.row.applyTime).subtract(3, 'days').format('YYYY/MM/DD') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 同意按钮 -->
            <el-tooltip class="item" effect="dark" content="同意申请" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-check" circle @click="accept(scope.row)"></el-button>
            </el-tooltip>
            <!-- 拒绝按钮 -->
            <el-tooltip class="item" effect="dark" content="拒绝申请" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="reject(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.currentPage"
      :page-sizes="[5, 10]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>

      <!-- 拒绝申请对话框 -->
      <el-dialog title="请填写拒绝理由" :visible.sync="rejDialogVisible" width="50%" @close="rejDialogClosed">
      <el-form :model="rejForm" :rules="rejFormRules" ref="rejFormRef" label-width="100px">
        <el-form-item label="拒绝理由" prop="rejectReason">
          <el-input type="textarea" v-model="rejForm.rejectReason" placeholder="请输入拒绝理由"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rej()">确 定</el-button>
      </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rejDialogVisible: false,
      applcationList: [
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
        { deptNo: 'CT12', deptName: '开发部02', roomNo: '101', meetingSize: '28', meetingTheme: '项目经验分享', meetingDate: '2022-7-22', meetingSlot: 2 }
      ],
      queryInfo: {
        pageSize: 5,
        currentPage: 1,
        auditStatus: 0
      },
      rejForm: {
        rejectItem: {},
        rejectItemIdx: 0,
        rejectReason: ''
      },
      rejFormRules: {
        rejectReason: [
          { required: true, message: '请输入拒绝理由', trigger: 'blur' },
          { max: 15, message: '拒绝理由不超过15个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    total () {
      return this.applcationList.length
    },
    applcationListDis () {
      return this.applcationList.slice(
        (this.queryInfo.currentPage - 1) * this.queryInfo.pageSize,
        this.queryInfo.currentPage * this.queryInfo.pageSize
      )
    }
  },
  methods: {
    async accept (item) {
      const confirmResult = await this.$confirm('此操作将批准这次申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消批准操作')
      }
      item.approved = true
      this.applcationList.splice(this.applcationList.indexOf(item), 1)
      this.$message.success('批准申请成功！')
    },
    reject (item) {
      this.rejForm.rejectItem = Object.assign({}, item)
      this.rejForm.rejectItemIdx = this.applcationList.indexOf(item)
      this.rejDialogVisible = true
    },
    rejDialogClosed () {
      this.$refs.rejFormRef.resetFields()
    },
    async rej () {
      const confirmResult = await this.$confirm('此操作将拒绝这次申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.rejDialogVisible = false
        return this.$message.info('已取消拒绝操作')
      }
      this.$refs.rejFormRef.validate(async valid => {
        if (!valid) return
        const item = this.rejForm.rejectItem
        item.approved = false
        item.rejectReason = this.rejForm.rejectReason
        this.applcationList.splice(this.rejForm.rejectItemIdx, 1)
        this.$message.success('拒绝申请成功！')
        this.rejDialogVisible = false
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
    },
    handleCurrentChange (newPage) {
      this.queryInfo.currentPage = newPage
    }
  }
}
</script>
