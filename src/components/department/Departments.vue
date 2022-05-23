<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输部门名" v-model="keyWord" clearable>
            <el-button slot="append" icon="el-icon-search" @click="selectDept"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加部门</el-button>
        </el-col>
      </el-row>

      <!-- 部门列表区 -->
      <el-table :data="deptListDisplay" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="部门编号" prop="deptNo"></el-table-column>
        <el-table-column label="部门名称" prop="deptName"></el-table-column>
        <el-table-column label="联系方式" prop="deptPhone"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip class="item" effect="dark" content="修改部门信息" placement="top" :enterable="false">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除部门" placement="top" :enterable="false">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeDeptById(scope.row)"></el-button>
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

    <!-- 查询部门对话框 -->
    <el-dialog title="查询部门" :visible.sync="queryDialogVisible" width="30%" @close="queryDialogClose">
      <el-form :model="queryForm" ref="queryFormRef" label-width="100px">
          <el-form-item label="部门编号" prop="deptNo">
            {{ queryForm.deptNo }}
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            {{ queryForm.deptName }}
          </el-form-item>
          <el-form-item label="联系方式" prop="deptPhone">
            {{ queryForm.deptPhone }}
          </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加部门对话框 -->
    <el-dialog title="添加部门" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="部门编号" prop="deptNo">
          <el-input v-model="addForm.deptNo"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="addForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="deptPhone">
          <el-input v-model="addForm.deptPhone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDept">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改部门对话框 -->
    <el-dialog title="修改会议室信息" :visible.sync="editDialogVisible" width="50%" :show-close="false" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="部门编号" prop="deptNo">
          <el-input v-model="editForm.deptNo"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="editForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="deptPhone">
          <el-input v-model="editForm.deptPhone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditDept">取 消</el-button>
        <el-button type="primary" @click="eidtDept">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证手机号
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入格式正确的手机'))
    }
    return {
      queryInfo: {
        currentPage: 1,
        pageSize: 5
      },
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
      keyWord: '',
      queryDialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      queryForm: {
        deptNo: '',
        deptName: '',
        deptPhone: ''
      },
      addForm: {
        deptNo: '',
        deptName: '',
        deptPhone: ''
      },
      addFormRules: {
        deptNo: [
          { required: true, message: '请输入部门编号', trigger: 'blur' },
          { min: 4, max: 4, message: '部门编号长度在3~4个数字之间', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        deptPhone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        deptNo: [
          { required: true, message: '请输入部门编号', trigger: 'blur' },
          { min: 4, max: 4, message: '部门编号长度在3~4个数字之间', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        deptPhone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    deptListDisplay () {
      return this.deptList.slice(
        (this.queryInfo.currentPage - 1) * this.queryInfo.pageSize,
        this.queryInfo.currentPage * this.queryInfo.pageSize
        )
    },
    total () {
      return this.deptList.length
    }
  },
  methods: {
    // 监听pageSize改变的事情
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.currentPage = newPage
    },
    selectDept () {
      const deptNoQuery = this.keyWord
      const deptNoQueryResult = this.deptList.find((item) => item.deptNo === deptNoQuery)
      if (deptNoQueryResult) {
        this.queryForm.deptNo = deptNoQueryResult.deptNo
        this.queryForm.deptName = deptNoQueryResult.deptName
        this.queryForm.deptPhone = deptNoQueryResult.deptPhone
        this.queryDialogVisible = true
        this.$message.success('查询部门信息成功！')
      } else {
        this.$message.error('查询部门信息失败！查询不到该部门编号')
      }
    },
    queryDialogClose () {
      this.$refs.queryFormRef.resetFields()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    addDept () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        const newdeptNo = this.addForm.deptNo
        const deptNoExist = this.deptList.find((item) => item.deptNo === newdeptNo)
        if (deptNoExist) {
          return this.$message.error('添加部门失败！部门已存在')
        }
        const dept = {}
        dept.deptNo = this.addForm.deptNo
        dept.deptName = this.addForm.deptName
        dept.deptPhone = this.addForm.deptPhone
        this.deptList.push(dept)
        this.$message.success('添加部门成功！')
        this.addDialogVisible = false
      })
    },
    showEditDialog (dept) {
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.editForm = this.deptList.find((item) => item.deptNo === dept.deptNo)
        this.editForm.indexBF = this.deptList.findIndex((item) => item.deptNo === dept.deptNo)
        this.editForm.deptNoBF = dept.deptNo
        this.editForm.deptNameBF = dept.deptName
        this.editForm.deptPhoneBF = dept.deptPhone
      })
    },
    eidtDept () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        const deptIdx = this.deptList.findIndex((item) => item.deptNo === this.editForm.deptNoBF)
        if (deptIdx === -1 && this.deptList.filter(item => item.deptNo === this.editForm.deptNo).length > 1) {
          const newdept = {}
          newdept.deptNo = this.editForm.deptNoBF
          newdept.deptName = this.editForm.deptNameBF
          newdept.deptPhone = this.editForm.deptPhoneBF
          this.deptList.splice(this.editForm.indexBF, 1, newdept)
          this.editDialogVisible = false
          this.$message.error('修改会议室信息失败！该会议室已存在')
        } else {
          const newdept = {}
          console.log(deptIdx, this.editForm)
          newdept.deptNo = this.editForm.deptNo
          newdept.deptName = this.editForm.deptName
          newdept.deptPhone = this.editForm.deptPhone
          this.deptList.splice(this.editForm.indexBF, 1, newdept)
          this.editDialogVisible = false
          this.$message.success('修改会议室信息成功！')
        }
      })
    },
    cancelEditDept () {
      const newDept = {}
      newDept.deptNo = this.editForm.deptNoBF
      newDept.deptName = this.editForm.deptNameBF
      newDept.deptPhone = this.editForm.deptPhoneBF
      this.deptList.splice(this.editForm.indexBF, 1, newDept)
      this.editDialogVisible = false
    },
    async removeDeptById (dept) {
      const confirmResult = await this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const deptIdx = this.deptList.findIndex(item => item.deptNo === dept.deptNo)
      this.deptList.splice(deptIdx, 1)
      this.$message.success('删除部门成功')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
