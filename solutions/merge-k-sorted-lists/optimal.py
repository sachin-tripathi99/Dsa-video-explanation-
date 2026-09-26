import heapq

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        heap = [(node.val, i, node) for i, node in enumerate(lists) if node]   # i breaks ties
        heapq.heapify(heap)
        dummy = tail = ListNode(0)
        while heap:
            _, i, node = heapq.heappop(heap)
            tail.next = tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next
