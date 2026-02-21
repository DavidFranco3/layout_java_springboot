package com.example.demo;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.io.PrintWriter;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoResourceFoundException.class)
    public void handleNoResourceFound(NoResourceFoundException ex, jakarta.servlet.http.HttpServletResponse response) {
        try {
            response.setStatus(404);
            response.setContentType("text/plain");
            PrintWriter out = response.getWriter();
            out.println("Resource not found: " + ex.getResourcePath());
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ExceptionHandler(Exception.class)
    public void handleAll(Exception ex, jakarta.servlet.http.HttpServletResponse response) {
        try {
            response.setStatus(500); // Changed to 500 so we know it's an internal error catching it
            response.setContentType("text/plain");
            PrintWriter out = response.getWriter();
            out.println("Exception caught by handleAll:");
            ex.printStackTrace(out);
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
