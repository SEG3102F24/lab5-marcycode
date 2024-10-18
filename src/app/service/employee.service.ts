
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../model/employee';
import { Database, ref, set, push, child, onValue } from '@angular/fire/database'; 

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesSubject: BehaviorSubject<readonly Employee[]> = new BehaviorSubject<readonly Employee[]>([]);
  public readonly $: Observable<readonly Employee[]> = this.employeesSubject.asObservable(); 

  private dbRef = ref(this.db, 'employees'); 

  constructor(private db: Database) {
    this.loadEmployeesFromDatabase();
  }

  addEmployee(employee: Employee) {
    const newEmployeeRef = push(child(this.dbRef, '/')); 
    return set(newEmployeeRef, employee) 
      .then(() => {
       
        this.employeesSubject.next([...this.employeesSubject.getValue(), employee]);
      })
      .catch((error) => {
        console.error('Error adding employee to Firebase: ', error);
      });
  }

  private loadEmployeesFromDatabase() {
    onValue(this.dbRef, (snapshot) => {
      const employeesList: Employee[] = [];
      snapshot.forEach((childSnapshot) => {
        const employee = childSnapshot.val();
        employeesList.push(employee);
      });
      this.employeesSubject.next(employeesList); 
    });
  }
}
