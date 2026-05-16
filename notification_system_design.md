

The campus notification platform allows students to receive notifications related to placements, events, and results.





\- Placement

\- Result

\- Event





GET http://4.224.186.213/evaluation-service/notifications





| Parameter | Description |

|---|---|

| limit | Number of notifications per page |

| page | Current page number |

| notification\_type | Filter notifications by Event, Result, or Placement |





\- Event

\- Result

\- Placement





\- Display all notifications

\- Display priority notifications

\- Filter notifications by notification type

\- Pagination using page and limit query parameters

\- Distinguish between new and viewed notifications

\- Mark individual notifications as viewed

\- Mark all notifications as viewed

\- Responsive layout for desktop and mobile screens

\- Error handling for failed API requests

\- Loading state while fetching notifications

\- Empty state when no notifications are found





Priority notifications are calculated using notification type and recency.



Priority order:



1\. Placement

2\. Result

3\. Event



Recent notifications are ranked higher within the same notification type.





Viewed notification IDs are stored in browser localStorage.



If a notification ID exists in localStorage, it is shown as viewed.



If a notification ID does not exist in localStorage, it is shown as new.





If the API request fails, the frontend displays a user-friendly error message.





\- Pagination avoids loading too many notifications at once.

\- Filtering is handled using API query parameters.

\- Viewed notification state is stored locally.

\- Priority notifications are calculated on the frontend.





The frontend uses responsive Material UI components so that the notification dashboard works on both desktop and mobile devices.

