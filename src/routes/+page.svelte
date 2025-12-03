<script lang="ts">
    import { onMount, afterUpdate } from 'svelte'

    import { Breadcrumbs, PageHeader } from '$components/header'

    let tasks = [
      { name: 'Task Name', date: 'Aug 03' },
      { name: 'Task Name', date: 'Aug 03' },
      { name: 'Task Name', date: 'Aug 03' },
      { name: 'Task Name', date: 'Aug 03' },
      { name: 'Task Name', date: 'Aug 03' },
    ]

    let workflows = [
      { title: 'Marketing / Campaign -01 Social Posts', status: 'Running', description: 'Lorem ipsum dolor sit amet consectetur. Ut turpis egestas neque ut diam bibendum. Lectus mi purus arcu consequat arcu eu. Nec massa seddiam bibendum. Lectus mi purus arcu consequat arcu eu. Nec massa seddiam bibendum. Lectus mi purus arcu consequat arcu eu. Nec massa seddiam bibendum. Lectus mi purus arcu consequat arcu eu. Nec massa seddiam bibendum. Lectus mi purus arcu consequat arcu eu. Nec massa seddiam bibendum. Lectus mi purus arcu consequat arcu eu. Nec massa sed...', updatedBy: '@arthur.g', time: 'an hour ago' },
      { title: 'Marketing / Campaign -01 Social Posts', status: 'Running', description: 'Lorem ipsum dolor sit amet consectetur. Ut turpis egestas neque ut diam bibendum. Lectus mi purus arcu consequat arcu eu. Nec massa sed...', updatedBy: '@arthur.g', time: 'an hour ago' },
      { title: 'Marketing / Campaign -01 Social Posts', status: 'Running', description: 'Lorem ipsum dolor sit amet consectetur. Ut turpis egestas neque ut diam bibendum. Lectus mi purus arcu consequat arcu eu. Nec massa sed...', updatedBy: '@arthur.g', time: 'an hour ago' },
      { title: 'Marketing / Campaign -01 Social Posts', status: 'Running', description: 'Lorem ipsum dolor sit amet consectetur. Ut turpis egestas neque ut diam bibendum. Lectus mi purus arcu consequat arcu eu. Nec massa sed...', updatedBy: '@arthur.g', time: 'an hour ago' },
    ]

    let progress = 75.55

    // TODO: redundant
    onMount(() => {
      const circle = document.querySelector('.arc-progress')
      const radius = circle.r.baseVal.value
      const circumference = radius * 2 * Math.PI + 200
      circle.style.strokeDasharray = `${circumference} ${circumference}`
      circle.style.strokeDashoffset = circumference
      const offset = circumference - (progress / 100) * circumference
      setTimeout(() => {
        circle.style.strokeDashoffset = offset
      }, 100)
    })

    afterUpdate(() => {
      document.querySelectorAll('.workflow-description').forEach((description) => {
        const readMore = description.nextElementSibling
        if (description.scrollHeight <= 40) {
          readMore.style.display = 'none'
        } else {
          readMore.style.display = 'block'
        }
      })
    })

    function toggleReadMore(event) {
      const parent = event.target.previousElementSibling
      const fullHeight = parent.scrollHeight
      if (parent.classList.contains('expanded')) {
        parent.style.maxHeight = '40px'
        event.target.textContent = 'Show more...'
      } else {
        parent.style.maxHeight = `${fullHeight}px`
        event.target.textContent = 'Show less'
      }
      parent.classList.toggle('expanded')
    }
</script>

<style lang="postcss">
    #dashboard {
        padding: 20px;
        border-radius: 8px;
        overflow: scroll;
        padding-bottom: 100px;
    }

    .card {
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        border: 1px solid #525866;
    }

    .header {
        font-size: 1.25rem;
        margin-bottom: 20px;
    }

    .task, .workflow {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        font-size: 13px;
        border-bottom: 1px solid #333;
    }

    .workflow {
        border: 1px solid #717784;
        border-radius: 10px;
        padding: 12px;
        margin-bottom: 10px;
    }

    .button {
        border: 1px solid;
        padding: 5px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        display: inline-block;
    }

    .usage {
        text-align: center;
    }

    .usage-header {
        display: flex;
        align-items: center;
        font-size: 1.25rem;
        margin-bottom: 20px;
    }

    .usage-header svg {
        margin-right: 10px;
    }

    .arc-container {
        position: relative;
        width: 400px; /* Adjusted width */
        height: 200px; /* Adjusted height */
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
    }

    .arc-background {
        stroke-width: 24; /* Adjusted stroke width */
    }

    .arc-progress {
        stroke: url(#gradient);
        stroke-width: 24; /* Adjusted stroke width */
        transition: stroke-dashoffset 1s ease;
    }

    .progress-text {
        position: absolute;
        text-align: center;
        margin-top: 80px;
    }

    .progress-text .percentage {
        font-size: 34px;
        font-weight: bold;
    }

    .taskList {
        position: relative;
        top: -5px;
    }

    .btn-icon {
        border: 1px solid #2B303B;
        padding: 4px;
        border-radius: 5px;
    }

    .btn-text{
        width: 68px;
        height: 25px;
        font-size: 11px;
        display: flex;
        text-align: center;
        padding: 1px;
        border-radius: 5px;
    }

    .btn-text img {
        width: 17px !important;
        margin-left: 5px;
    }

    .progress-text .increase {
        color: #10B981;
        display: flex;
        font-size: 12px;
    }

    .details {
        display: flex;
        justify-content: space-evenly;
        margin-top: 20px;
    }

    .details div {
        text-align: center;
        font-size: 11px;
        color: #838997;
    }

    .details .price {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .details .increase {
        color: green;
    }

    .workflow-description {
        max-height: 40px;
        overflow: hidden;
        position: relative;
        transition: max-height 0.5s ease;
    }

    .workflow-description.expanded {
        max-height: none;
    }

    .workflow-description:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20px;
    }

    .workflow-description.expanded:after {
        display: none;
    }



    .workflow-icons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .workflow-icons img {
        width: 24px;
        height: 24px;
    }
</style>

<PageHeader>
  {#snippet breadcrumbs()}
    <Breadcrumbs breadcrumbs={[{ link: '', title: 'Dashboard' }]} />
  {/snippet}
</PageHeader>

<div id="dashboard" class=" grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="card col-span-2 lg:col-span-1 usage">
        <div class="usage-header">

            <span>Usage</span>
        </div>
        <div class="arc-container">
            <svg width="400" height="200" viewBox="0 0 400 200">
                <defs>
                    <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="0">
                        <stop offset="0%" stop-color="#FF0080"/>
                        <stop offset="100%" stop-color="#7928CA"/>
                    </linearGradient>
                </defs>
                <circle class="arc-background" cx="200" cy="200" r="180" fill="none"/>
                <circle class="arc-progress" cx="200" cy="200" r="180" fill="none"/>
            </svg>
            <div class="progress-text">
                <div class="percentage">{progress}%</div>
                <div class="increase mt-4">10% <svg class="relative top-[6px]" xmlns="http://www.w3.org/2000/svg" fill="#10B981" viewBox="0 0 24 24" width="14" height="14"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5l7 7h-4v4h-6v-4h-4l7-7z"/></svg>
                    <span class="text-gray-400 ml-2">+$150 today</span></div>
            </div>
        </div>
        <div class="details">
            <div>
                <div>Overall</div>
                <div class="price">$320k</div>
            </div>
            <div>
                <div>Today</div>
                <div class="price">$5k</div>
            </div>
            <div>
                <div>This Week</div>
                <div class="price">$7.5k</div>
            </div>
        </div>
        <div class="details">
            <div>WE CHARGE 0.01 USD FOR EVERY 100 MB EXTRA</div>
        </div>
    </div>

    <div class="card col-span-2 lg:col-span-1">
        <div class="header flex justify-between">
            <div class="flex flex-1">

                <span>My Tasks</span>
            </div>

            <button class="button">See All</button>
        </div>
        {#each tasks as task}
            <div class="task">
                <span>{task.name}</span>
                <span class="date">{task.date}</span>
            </div>
        {/each}
        <button class="button w-full mt-4">View All 25 Tasks</button>
    </div>

    <div class="card col-span-2 lg:col-span-1">
        <div class="header flex justify-between">
            <div class="flex flex-1">

                <span>Running Workflows</span>
            </div>
            <button class="button">See All</button>
        </div>
        {#each workflows as workflow}
            <div class="workflow">
                <div>
                    <div>{workflow.title}</div>
                    <div class="workflow-description">
                        <div class="text-sm text-gray-400">{workflow.description}</div>
                    </div>
                    <span class="read-more" on:click={toggleReadMore}>Show more...</span>
                    <div class="workflow-icons">
                        <div class="btn-text">

                            Models
                        </div>


                        <div class="btn-text">
                            Tools
                        </div>
                    </div>
                </div>
                <div class="text-sm text-green-400">{workflow.status}</div>
            </div>
        {/each}
    </div>

    <div class="card col-span-2 lg:col-span-1">
        <div class="header flex justify-between">
            <div class="flex flex-1">
                <span>Recently Updated</span>
            </div>
            <button class="button">See All</button>
        </div>
        {#each workflows as workflow}
            <div class="workflow">
                <div>
                    <div>{workflow.title}</div>
                    <div class="workflow-description">
                        <div class="text-sm text-gray-400">{workflow.description}</div>
                    </div>
                    <span class="read-more" on:click={toggleReadMore}>Show more...</span>
                    <div class="workflow-icons">
                        <div class="btn-text">
                            Models
                        </div>

                        <div class="btn-text">
                            Tools
                        </div>
                    </div>
                </div>
                <div class="text-sm text-green-400">{workflow.status}</div>
            </div>
        {/each}
    </div>
</div>
