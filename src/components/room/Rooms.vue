<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会议室管理</el-breadcrumb-item>
      <el-breadcrumb-item>会议室信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入会议室号" v-model="keyWord" clearable>
              <el-button slot="append" icon="el-icon-search" @click="selectRoom"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加会议室</el-button>
          </el-col>
      </el-row>

      <!-- 会议室列表区 -->
      <el-table :data="roomListDisplay" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="会议室号" prop="roomNo"></el-table-column>
        <el-table-column label="可容纳人数" prop="roomSize"></el-table-column>
        <el-table-column label="会议室状态" prop="roomStatus">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.roomStatus"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip class="item" effect="dark" content="修改会议室信息" placement="top" :enterable="false">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除会议室" placement="top" :enterable="false">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoomById(scope.row)"></el-button>
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

    <!-- 查询会议室对话框 -->
    <el-dialog title="查询会议室" :visible.sync="queryDialogVisible" width="30%" @close="queryDialogClose">
      <el-form :model="queryForm" ref="queryFormRef" label-width="100px">
          <el-form-item label="会议室号" prop="roomNo">
            {{ queryForm.roomNo }}
          </el-form-item>
          <el-form-item label="可容纳人数" prop="roomSize">
            {{ queryForm.roomSize }}
          </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加会议室对话框 -->
    <el-dialog title="添加会议室" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="会议室号" prop="roomNo">
            <el-input v-model="addForm.roomNo"></el-input>
          </el-form-item>
          <el-form-item label="可容纳人数" prop="roomSize">
            <el-input type="number" v-model="addForm.roomSize"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoom">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改会议室信息对话框 -->
    <el-dialog title="修改会议室信息" :visible.sync="editDialogVisible" width="50%" :show-close="false" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="会议室号">
            <el-input v-model="editForm.roomNo" prop="roomNo"></el-input>
          </el-form-item>
          <el-form-item label="可容纳人数">
            <el-input type="number" v-model="editForm.roomSize" prop="roomSize"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelEditRoom">取 消</el-button>
          <el-button type="primary" @click="eidtRoom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        currentPage: 1,
        pageSize: 5
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
      ],
      keyWord: '',
      queryDialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      queryForm: {
        roomNo: '',
        roomSize: 1
      },
      addForm: {
        roomNo: '',
        roomSize: 1
      },
      addFormRules: {
        roomNo: [
          { required: true, message: '请输入会议室号', trigger: 'blur' },
          { min: 3, max: 4, message: '会议室号长度在3~4个数字之间', trigger: 'blur' }
        ],
        roomSize: [
          { required: true, message: '请输入可容纳人数', trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        roomNo: [
          { required: true, message: '请输入会议室号', trigger: 'blur' },
          { min: 3, max: 4, message: '会议室号长度在3~4个数字之间', trigger: 'blur' }
        ],
        roomSize: [
          { required: true, message: '请输入可容纳人数', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    roomListDisplay () {
      return this.roomList.slice(
        (this.queryInfo.currentPage - 1) * this.queryInfo.pageSize,
        this.queryInfo.currentPage * this.queryInfo.pageSize
        )
    },
    total () {
      return this.roomList.length
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
      selectRoom () {
        const roomNoQuery = this.keyWord
        const roomNoQueryResult = this.roomList.find((item) => item.roomNo === roomNoQuery)
        if (roomNoQueryResult) {
          this.queryForm.roomNo = roomNoQueryResult.roomNo
          this.queryForm.roomSize = roomNoQueryResult.roomSize
          this.queryDialogVisible = true
          this.$message.success('查询会议室信息成功！')
        } else {
          this.$message.error('查询会议室信息失败！查询不到该会议室号')
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
      addRoom () {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          const newRoomNo = this.addForm.roomNo
          const roomNoExist = this.roomList.find((item) => item.roomNo === newRoomNo)
          if (roomNoExist) {
            return this.$message.error('添加会议室失败！会议室已存在')
          }
          const room = {}
          room.roomNo = this.addForm.roomNo
          room.roomSize = this.addForm.roomSize
          room.roomStatus = true
          this.roomList.push(room)
          this.$message.success('添加会议室成功！')
          this.addDialogVisible = false
        })
      },
      showEditDialog (room) {
        this.editDialogVisible = true
        this.$nextTick(() => {
          this.editForm = this.roomList.find((item) => item.roomNo === room.roomNo)
          this.editForm.indexBF = this.roomList.findIndex((item) => item.roomNo === room.roomNo)
          this.editForm.roomNoBF = room.roomNo
          this.editForm.roomSizeBF = room.roomSize
          this.editForm.roomStatusBF = room.roomStatus
        })
      },
      eidtRoom () {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return
            const roomIdx = this.roomList.findIndex((item) => item.roomNo === this.editForm.roomNoBF)
            if (roomIdx === -1 && this.roomList.filter(item => item.roomNo === this.editForm.roomNo).length > 1) {
              const newRoom = {}
              newRoom.roomNo = this.editForm.roomNoBF
              newRoom.roomSize = this.editForm.roomSizeBF
              newRoom.roomStatus = this.editForm.roomStatusBF
              this.roomList.splice(this.editForm.indexBF, 1, newRoom)
              this.editDialogVisible = false
              this.$message.error('修改会议室信息失败！该会议室已存在')
            } else {
              const newRoom = {}
              newRoom.roomNo = this.editForm.roomNo
              newRoom.roomSize = this.editForm.roomSize
              newRoom.roomStatus = true
              this.roomList.splice(this.editForm.indexBF, 1, newRoom)
              this.editDialogVisible = false
              this.$message.success('修改会议室信息成功！')
            }
        })
      },
      cancelEditRoom () {
        const newRoom = {}
        newRoom.roomNo = this.editForm.roomNoBF
        newRoom.roomSize = this.editForm.roomSizeBF
        newRoom.roomStatus = this.editForm.roomStatusBF
        this.roomList.splice(this.editForm.indexBF, 1, newRoom)
        this.editDialogVisible = false
      },
      async removeRoomById (room) {
        const confirmResult = await this.$confirm('此操作将永久删除该会议室, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const roomIdx = this.roomList.findIndex(item => item.roomNo === room.roomNo)
        this.roomList.splice(roomIdx, 1)
        this.$message.success('删除会议室成功')
      }
  }
}
</script>

<style lang="less" scoped>
</style>
