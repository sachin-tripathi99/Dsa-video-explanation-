class Solution:
    def deleteMiddle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        n, p = 0, head
        while p:
            n += 1
            p = p.next
        if n == 1:
            return None
        p = head
        for _ in range(n // 2 - 1):
            p = p.next
        p.next = p.next.next
        return head
