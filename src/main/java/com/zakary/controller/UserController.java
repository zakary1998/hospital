package com.zakary.controller;

import com.zakary.dao.DepartmentDao;
import com.zakary.dao.DoctorDao;
import com.zakary.dao.JsonResultDao;
import com.zakary.services.DepartmentService;
import com.zakary.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired  //这个别忘了
    private DoctorService doctorService;
    @Autowired
    private DepartmentService departmentService;
    //这部分是页面映射
    @RequestMapping("/login")
    public String loginPage(){
        return "login";
    }
    @RequestMapping("/resign")
    public String resignPage(){
        return "resign";
    }

    @RequestMapping("/login.do")
    @ResponseBody
    public JsonResultDao login(@RequestBody DoctorDao doctorDao, HttpServletRequest request){
        doctorService.login(doctorDao);
        HttpSession session = request.getSession();
        session.setAttribute("cert_code", doctorDao.getCert_code());
        return new JsonResultDao(doctorDao.getPage());
    }

    @RequestMapping("/getDepartment.do")
    @ResponseBody
    public JsonResultDao getDepartment(){
        return new JsonResultDao(departmentService.getDepartments());
    }
    @RequestMapping("/getPosition.do")
    @ResponseBody
    public JsonResultDao getPosition(@RequestBody DepartmentDao doctorDao){
        return new JsonResultDao(departmentService.getPositions(doctorDao));
    }
    @RequestMapping("/insertDoctor.do")
    @ResponseBody
    public JsonResultDao rootInsertDoctor(@RequestBody DoctorDao doctorDao){
        doctorService.insertDoctor(doctorDao);
        return new JsonResultDao("success");
    }
}
