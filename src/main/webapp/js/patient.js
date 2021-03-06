var tableIns;
var tableInsRom;
var tableInsTreatment;
var form;
var layer;
$(document).ready(function () {
    layer = layui.layer;
    form  = layui.form;
    var element = layui.element;
    element.on('nav(nav_left)',function (elem) {
        switch (elem.context.innerText) {
            case '基本信息管理':
                hideAll();
                showPatients();
                $('#floor').html('基本信息管理')
                $('#patient_info').show()
                break;
            case '手术信息管理':
                hideAll();
                showTreatment();
                $('#floor').html('手术信息管理')
                $('#treatment_info').show();
                break;
            case '病床管理':
                hideAll()
                showSickRom();
                $('#floor').html('病床管理')
                $('#sick_rom').show()
                break;
            //case '处方管理':
             //   hideAll();
             //   showPatientPrescription();
             //   $('#floor').html('处方管理')
              //  $('#prescription').show()

        }
    })
    element.init();

})
function showPatients() {
    var laydate = layui.laydate;
    laydate.render({elem: '#time'})
    form.on('submit(doSubmit)',function (data) {
        $('#myModal').modal('hide');
        var index = layer.load(2);
        $.ajax({
            url:'/hospital/patient/doctor_addpatient',
            type:'post',
            contentType:"application/json",
            datatype:"json",
            data : JSON.stringify(data.field)
        }).done(function (data) {
            if(data.code==0){
                layer.close(index);
                layer.msg("添加成功",{time: 1000},function () {
                    tableIns.reload({where: {patient_cert_code: '',}, page: {curr: 1}})
                })
            }else{
                layer.close(index);
                layer.msg(data.msg,{time:1000})
            }
        })
    })

    form.on('submit(prescription_doSubmit)',function (data) {
        $('#sick_Modal').modal('hide');
        var result = data.field;
        var count=parseInt($("#drug_cursor").children("div:last-child").attr("value"));
        var str = []
        for(var i=1;i<=count;i++){
            var temp = '{"patient_cert_code":'+result['patient_cert_code']+',"drug_name":"'+result['drug_name'+i]+'","drug_num":'+result['drug_num'+i]+'}'
            str.push(JSON.parse(temp))
        }
        console.log(str)
        var index = layer.load(2);
        $.ajax({
            url:'/hospital/patient/makePrescribtion',
            type:'post',
            contentType:"application/json",
            datatype:"json",
            data : JSON.stringify(str)
        }).done(function (data) {
            if(data.code==0){
                layer.close(index);
                layer.msg("成功",{time: 1000},function () {
                    tableIns.reload({where: {patient_cert_code: '',}, page: {curr: 1}})
                })
            }else{
                layer.close(index);
                layer.msg(data.msg,{time:1000})
            }
        })
    })
    form.on('submit(AddPatientSubmit)',function (data) {
        var jsonObj = data.field;
        jsonObj.old_cert_code = data.field.cert_code
        $('#add_patient_modal').modal('hide');
        var index = layer.load(2)
        var text = $('#patient_modal_label').html();
        var url = '';
        if(text == '新增患者'){
            url = '/hospital/patient/addPatientByInfo'
        }else if(text == '修改信息'){
            url = '/hospital/patient/alterPatientInfo'
        }
        $.ajax({
            url:url,
            type:'post',
            contentType:"application/json",
            datatype:"json",
            data : JSON.stringify(jsonObj)
        }).done(function (data) {
            if(data.code==0){
                layer.close(index);
                layer.msg("成功",{time: 1000},function () {
                    tableIns.reload({where: {patient_cert_code: ''}})
                })
            }else{
                layer.close(index);
                layer.msg(data.msg,{time:1000})
            }
        })
    })
    form.render();
    var table = layui.table;
    tableIns = table.render({
        elem: '#patient',
        url: '/hospital/patient/doctor_patients', //数据接口
        skin: 'row ', //行边框风格
        page: true,
        cols: [[
            {field: 'patient_name', title: '姓名', width: '20%', unresize: true},
            {field: 'cert_code', title: '证件号', width: '20%', unresize: true},
            {field: 'patient_gender', title: '性别', width: '10%', unresize: true},
            {field: 'patient_age', title: '年龄', width: '10%', unresize: true},
            {field: 'patient_tel', title: '联系方式', width: '20%', unresize: true},
            {field: 'create_date', title: '入院时间', width: '10%', unresize: true},
            {
                field: 'action',
                title: '操作',
                width: '10%',
                unresize: true,
                toolbar: '<div>' +
                    '<button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="edit">修改信息</button>' +
                    '<button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="make">开处方</button>' +
                    '</div>'
            }
        ]]
    });
    table.on('tool(patient_table)',function (obj) {
        var datas = obj.data;

         if(obj.event=='make'){
             $("#drug_cursor").empty();
             $("#drug_cursor").append('<div class="layui-form-item" value="1">\n' +
                 '                                <div class="layui-inline">\n' +
                 '                                    <label class="layui-form-label">名称</label>\n' +
                 '                                    <div class="layui-input-inline">\n' +
                 '                                        <input type="text" name="drug_name1" placeholder="药品名称" autocomplete="off" lay-verify="required" class="layui-input">\n' +
                 '                                    </div>\n' +
                 '                                    <div class="layui-form-mid">数量</div>\n' +
                 '                                    <div class="layui-input-inline">\n' +
                 '                                        <input type="number" name="drug_num1" placeholder="药品数量" autocomplete="off" lay-verify="required" class="layui-input">\n' +
                 '                                    </div>\n' +
                 '                                </div>\n' +
                 '                            </div>');
             form.val("drug_form",{"patient_cert_code":datas.cert_code})
             $('#prescription_Modal').modal('show')
         }

        if(obj.event=='edit'){
            form.val("addForm",datas)
            $('#patient_modal_label').html('修改信息')
            $('#add_patient_modal').modal('show');
        }

    })
}
function search() {
    tableIns.reload({where: {patient_cert_code: $('#search_id').val(),}, page: {curr: 1}})
    $('#search_id').val('');
}
function insert() {
    form.val("addForm",{"cert_code":"","patient_name":"","patient_gender":"男","patient_age":"","patient_tel":""})
    $('#patient_modal_label').html('新增患者')
    $('#add_patient_modal').modal('show');
}
function insertPatient() {
    $('#hideSubmit').click()
}
function allotSick() {
    $('#sickHideSubmit').click()
}
function prescription() {
    $('#prescriptionHideSubmit').click()
}
function formadd() {
    var last_id=parseInt($("#drug_cursor").children("div:last-child").attr("value"))+1;
    console.log(last_id)
    var html = '<div class="layui-form-item" value="'+last_id+'">\n' +
        '                                <div class="layui-inline">\n' +
        '                                    <label class="layui-form-label">名称</label>\n' +
        '                                    <div class="layui-input-inline">\n' +
        '                                        <input type="text" name="drug_name'+last_id+'" placeholder="药品名称" autocomplete="off" lay-verify="required" class="layui-input">\n' +
        '                                    </div>\n' +
        '                                    <div class="layui-form-mid">数量</div>\n' +
        '                                    <div class="layui-input-inline">\n' +
        '                                        <input type="number" name="drug_num'+last_id+'" placeholder="药品数量" autocomplete="off" lay-verify="required" class="layui-input">\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </div>'
    $("#drug_cursor").append(html);
    form.render()
}
function showSickRom() {
    form.on('submit(sick_doSubmit)',function(data){
        $('#sick_Modal').modal('hide');
        var index = layer.load(2);
        $.ajax({
            url:'/hospital/patient/ArrangeSickbed',
            type:'post',
            contentType:"application/json",
            datatype:"json",
            data : JSON.stringify(data.field)
        }).done(function (data) {
            if(data.code==0){
                layer.close(index);
                layer.msg("分配成功",{time: 1000},function () {
                    tableInsRom.reload({where: {patient_cert_code: ''}})
                })
            }else{
                layer.close(index);
                layer.msg(data.msg,{time:1000})
            }
        })
    })
    var table = layui.table;
    tableInsRom = table.render({
        elem: '#rom_table',
        url: '/hospital/patient/getAllPatientsSickbedInfo', //数据接口
        skin: 'row ', //行边框风格
        page: true,
        cols: [[
            {field: 'patient_name', title: '姓名', width: '20%', unresize: true},
            {field: 'cert_code', title: '证件号', width: '20%', unresize: true},
            {field: 'patient_gender', title: '性别', width: '20%', unresize: true},
            {field: 'patient_age', title: '年龄', width: '10%', unresize: true},
            {field: 'sickroom_id', title: '病房', width: '10%', unresize: true},
            {field: 'sickbed_id', title: '病床', width: '10%', unresize: true},
            {
                field: 'has_sickbed',
                title: '操作',
                width: '10%',
                unresize: true,
                templet: '#sick_bar'
            }
        ]]
    });
    table.on('tool(sick_rom_table)',function (obj) {
        var datas = obj.data;
        $('#sick_roms').empty();
        if(obj.event=='allot'){
            form.val("sickForm",{"sickbed_id":""})
            $.ajax({ //getSickroomCount
                url:'/hospital/patient/getSickroomCount',
                type:'post',
                contentType:"application/json",
                datatype:"json",
            }).done(function (data) {
                if(data.code==0){
                    var html = '<option value=""></option>';
                    for(var i = 0;i<data.data;i++){
                        html += '<option value="'+(i+1)+'">'+(i+1)+'</option>';
                    }
                    $('#sick_roms').append(html)
                    form.render();
                    console.log(datas)
                    form.val("sickForm",{"patient_cert_code":datas.cert_code})
                    $('#sick_Modal').modal('show');
                }else{
                    layer.msg(data.msg)
                }
            })
        }
    })
}
function showTreatment() {
    var table = layui.table;
    tableInsTreatment = table.render({
        elem: '#treatment_table',
        url: '/hospital/patient/getTreatmentCount', //数据接口
        skin: 'row ', //行边框风格
        page: true,
        cols: [[
            {field: 'patient_name', title: '姓名', width: '10%', unresize: true},
            {field: 'cert_code', title: '证件号', width: '20%', unresize: true},
            {field: 'done', title: '已完成', width: '20%', unresize: true},
            {field: 'undone', title: '未完成', width: '20%', unresize: true},
            {field: 'all_count', title: '总数', width: '20%', unresize: true},
            {
                field: 'action',
                title: '操作',
                width: '10%',
                unresize: true,
                templet: '<div><button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="add">新增</button>' +
                    '<button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="showInfo">查看详情</button></div>'
            }
        ]]
    });
    table.on('tool(treatment_table)',function (obj) {
        var datas = obj.data;
        if(obj.event=='add'){
            var laydate = layui.laydate;
            laydate.render({elem: '#time',type: 'datetime'});
            form.val("insertForm",{"cert_code":datas.cert_code,"patient_name":datas.patient_name,"treatment_name":"","treatment_time":null,"treatment_fee":""});
            form.on('submit(doSubmit)',function (data) {
                $('#myModal').modal('hide')
                var index = layer.load(2);
                var jsonObj = data.field;
                jsonObj.patient_cert_code = jsonObj.cert_code;
                delete jsonObj['cert_code'];
                delete jsonObj['patient_name'];
                $.ajax({
                    url:'/hospital/patient/doctor_addpatient',
                    type:'post',
                    contentType:"application/json",
                    datatype:"json",
                    data:JSON.stringify(jsonObj)
                }).done(function (data) {
                    if(data.code==0){
                        layer.close(index)
                        layer.msg("成功",{time: 1000},function () {
                            tableInsTreatment.reload({where: {patient_cert_code: ''}})
                        })
                    }else{
                        layer.close(index)
                        layer.msg(data.msg)
                    }
                })
            })
            $('#myModal').modal('show')
        }else if(obj.event=='showInfo'){
            var util = layui.util;
            var table = layui.table;
            table.render({
                elem: '#treatment_table_info',
                url: '/hospital/patient/getAllTreatmentByPatientCert', //数据接口
                where:{patient_cert_code:datas.cert_code},
                skin: 'row ', //行边框风格
                toolbar: '<div><button class="layui-btn layui-btn-sm layui-btn-normal" onclick="back()">返回</button></div>',
                page: true,
                cols: [[
                    {field: 'patient_name', title: '姓名', width: '10%', unresize: true},
                    {field: 'patient_cert_code', title: '证件号', width: '20%', unresize: true},
                    {field: 'treatment_name', title: '手术名称', width: '20%', unresize: true},
                    {field: 'treatment_fee', title: '手术费用', width: '20%', unresize: true},
                    {field: 'treatment_time', title: '手术时间', width: '20%', unresize: true,templet:function(d){return util.toDateString(d.treatment_time)}},
                    {field: 'complete', title: '状态', width: '10%', unresize: true}
                ]]
            });
            hideAll();
            $('#floor').html('手术信息管理/'+datas.patient_name)
            $('#treatment_infos').show()
        }
    })
}
function searchRom () {
    tableInsRom.reload({where: {patient_cert_code: $('#search_id_rom').val(),}, page: {curr: 1}})
    $('#search_id_rom').val('');
}
function hideAll() {
    $('#patient_info').hide();
    $('#sick_rom').hide();
    $('#treatment_info').hide();
    $('#treatment_infos').hide();
    //$('#prescription').hide();
}
function searchTreatment() {
    tableInsTreatment.reload({where: {patient_cert_code: $('#search_id_treatment').val(),}, page: {curr: 1}})
    $('#search_id_treatment').val('');
}
function back() {
    $('#floor').html('手术信息管理')
    hideAll();
    $('#treatment_info').show();
}