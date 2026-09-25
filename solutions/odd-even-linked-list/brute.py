class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        vals = []
        while head:
            vals.append(head.val)
            head = head.next
        dummy = tail = ListNode()
        for x in vals[0::2] + vals[1::2]:        # odd positions, then even positions
            tail.next = ListNode(x)
            tail = tail.next
        return dummy.next
