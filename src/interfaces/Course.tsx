import {saveCourses} from "../components/PathForm";

export interface CourseInterface {
    path: string,
    currentFile?: string,
    currentSubtitle?: string,
    currentTime?: number
}

export class Course implements CourseInterface {
    path: string;
    currentFile: string;
    currentSubtitle: string;
    currentTime: number;

    constructor(props: CourseInterface) {
        this.path = props.path
        this.currentFile = props.currentFile || ''
        this.currentSubtitle = props.currentSubtitle || ''
        this.currentTime = props.currentTime || 0

    }

    private static getCourses(): Course[] {
        return JSON.parse(localStorage.getItem('courses') || '[]').map((course:Course)=> new Course(course))
    }

    static findCourse(path: string): Course {


        const course = Course.getCourses().find((course: Course) => course.path === path)
        return course || new Course({path})
    }

    save() {
        !Course.findCourse(this.path) && saveCourses([this])
    }

    update(props: { }) {
        const courses = Course.getCourses()
        const course = courses.find(course=>course.path===this.path)
        if (course) {
            Object.assign(course,props)
            saveCourses(courses)
        }

    }
}
