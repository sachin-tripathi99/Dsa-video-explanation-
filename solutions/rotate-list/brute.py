class Solution:
    def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        n, p = 0, head
        while p:
            n += 1
            p = p.next
        for _ in range(k % n):                  # move the tail to the front
            p = head
            while p.next.next:
                p = p.next
            p.next.next = head
            head = p.next
            p.next = None
        return head
