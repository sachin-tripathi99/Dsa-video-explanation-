class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        vals = []
        for head in (list1, list2):
            while head:
                vals.append(head.val)
                head = head.next
        dummy = tail = ListNode()
        for x in sorted(vals):
            tail.next = ListNode(x)
            tail = tail.next
        return dummy.next
