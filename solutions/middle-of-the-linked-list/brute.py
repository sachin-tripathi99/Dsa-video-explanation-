class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        n, p = 0, head
        while p:
            n += 1
            p = p.next
        p = head
        for _ in range(n // 2):
            p = p.next
        return p
