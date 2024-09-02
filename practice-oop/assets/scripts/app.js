class DOMHelper {
    static clearEventListener(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static moveElement(elementId, newDestinationSelector) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);

        // to scroll to the element
        // ul.scrollTo(x,y);
        // ul.scrollBy(x,y);
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

class Component {
    constructor(hostElementId, insertBefore = false) {
        if (hostElementId) {
            this.hostElement = document.getElementById(hostElementId);
        } else {
            this.hostElement = document.body;
        }

        this.insertBefore = insertBefore;
    }

    detach() {
        if (this.element) {
            // this.element.remove();
            this.element.parentElement.removeChild(this.element);
        }
    }

    attach() {
        this.hostElement.insertAdjacentElement(
            this.insertBefore ? 'afterbegin' : 'beforeend',
            this.element
        );
    }
}

class Tooltip extends Component {
    constructor(closeNotifierFunction, tooltipText, hostElementId) {
        super(hostElementId);
        this.closeNotifier = closeNotifierFunction;
        this.tooltipText = tooltipText;
        this.create();
    }

    closeTooltip = () => {
        this.detach();
        this.closeNotifier();
    }

    create() {
        // console.log(this.hostElement.getBoundingClientRect());
        const toolTipElement = document.createElement('div');
        toolTipElement.className = 'card';

        const tooltipTemplate = document.getElementById("tooltip");
        const tooltipBody = document.importNode(tooltipTemplate.content, true);
        tooltipBody.querySelector('p').textContent = this.tooltipText;
        toolTipElement.append(tooltipBody);

        const hostElPosLeft = this.hostElement.offsetLeft;
        const hostElPosTop = this.hostElement.offsetTop;
        const hostElHeight = this.hostElement.clientHeight;
        const parentElementScrolling = this.hostElement.parentElement.scrollTop;

        const x = hostElPosLeft + 20;
        const y = hostElPosTop + hostElHeight - parentElementScrolling - 10;

        toolTipElement.style.position = 'absolute';
        toolTipElement.style.left = x + 'px';
        toolTipElement.style.top = y + 'px';

        toolTipElement.addEventListener('click', this.closeTooltip);
        this.element = toolTipElement;
    }
}

class ProjectItem {
    hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction, type) {
        this.id = id;
        this.updateProjectListHandler = updateProjectListsFunction;
        this.connectSwitchButton(type);
        this.connectMoreInfoButton();
        this.connectDrag();
    }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }

        const projectElement = document.getElementById(this.id);
        const tooltipText = projectElement.dataset.extraInfo;
        const tooltip = new Tooltip(
            () => {
                this.hasActiveTooltip = false;
            },
            tooltipText,
            this.id
        );
        tooltip.attach();
        this.hasActiveTooltip = true;
    }

    connectDrag() {
        document.getElementById(this.id).addEventListener("dragstart", event => {
            event.dataTransfer.setData('text/plain', this.id);
            event.dataTransfer.effectAllowed = "move";
        })
    }

    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        let moreInfoButton = projectItemElement.querySelector("button:first-of-type");
        moreInfoButton.addEventListener('click', this.showMoreInfoHandler.bind(this));
    }

    connectSwitchButton(type) {
        const projectItemElement = document.getElementById(this.id);
        let switchButton = projectItemElement.querySelector("button:last-of-type");
        switchButton = DOMHelper.clearEventListener(switchButton);
        switchButton.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchButton.addEventListener(
            'click',
            this.updateProjectListHandler.bind(null, this.id)
        );
    }

    updateListener(updateProjectListFn, type) {
        this.updateProjectListHandler = updateProjectListFn;
        // to change text content and re-attach listener 
        this.connectSwitchButton(type);
    }
}

class ProjectList {
    type;
    projects = [];
    switchHandler;

    constructor(type) {
        this.type = type;
        const projectItems = document.querySelectorAll(`#${this.type}-projects li`);
        for (const projectItem of projectItems) {
            this.projects.push(
                new ProjectItem(
                    projectItem.id,
                    this.switchProject.bind(this),
                    this.type
                )
            );
        }
        this.connectDroppable();
    }

    connectDroppable() {
        const list = document.querySelector(`#${this.type}-projects ul`);
        list.addEventListener('dragenter', event => {
            if (event.dataTransfer.types[0] === 'text/plain') {
                list.parentElement.classList.add('droppable');
                event.preventDefault();
            }
        });

        list.addEventListener('dragleave', event => {
            // check the element pointed is not inside the projctslist
            if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
                list.parentElement.classList.remove('droppable');
            }
        });


        list.addEventListener('dragover', event => {
            if (event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
            }
        });

        list.addEventListener('drop', event => {
            const projectId = event.dataTransfer.getData('text/plain');
            if (this.projects.find(proj => proj.id === projectId)) {
                return;
            }

            // simulate the click to move the item 
            document.getElementById(projectId).querySelector('button:last-of-type').click();
            list.parentElement.classList.remove('droppable');
        });
    }

    setSwitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`)
        project.updateListener(this.switchProject.bind(this), this.type);
    }

    switchProject(id) {
        // const projectIndex = this.projects.findIndex(project => project.id === id);
        // this.projects.splice(projectIndex, 1);

        // call the other's add and remove from own
        this.switchHandler(
            this.projects.find(project => project.id === id)
        );
        this.projects = this.projects.filter(project => project.id !== id);
    }
}

class App {
    static init() {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandlerFunction(
            finishedProjectList.addProject.bind(finishedProjectList)
        );
        finishedProjectList.setSwitchHandlerFunction(
            activeProjectList.addProject.bind(activeProjectList)
        );

        document.getElementById("analytic-btn").addEventListener("click", this.startAnalytics);
    }

    // dynamically append script (when button click etc)
    static startAnalytics() {
        const someScript = document.createElement('script');
        someScript.src = 'assets/scripts/analytics.js';
        someScript.defer = true;
        document.head.append(someScript);
    }
}

App.init();