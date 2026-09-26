class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next and prev.next.next:
            a, b = prev.next, prev.next.next
            a.next = b.next                     # a points past the pair
            b.next = a                          # b points back at a
            prev.next = b                       # the pair now starts with b
            prev = a
        return dummy.next
