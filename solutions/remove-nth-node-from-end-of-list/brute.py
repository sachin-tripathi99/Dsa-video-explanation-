class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        length, p = 0, head
        while p:
            length += 1
            p = p.next
        dummy = ListNode(0, head)
        p = dummy
        for _ in range(length - n):
            p = p.next
        p.next = p.next.next
        return dummy.next
