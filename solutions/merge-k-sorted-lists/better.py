class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        def merge_two(a, b):
            dummy = tail = ListNode(0)
            while a and b:
                if a.val <= b.val:
                    tail.next, a = a, a.next
                else:
                    tail.next, b = b, b.next
                tail = tail.next
            tail.next = a or b
            return dummy.next

        result = None
        for l in lists:
            result = merge_two(result, l)
        return result
