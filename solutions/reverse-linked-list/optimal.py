class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev, cur = None, head
        while cur:
            nxt = cur.next                      # remember the rest
            cur.next = prev                     # flip
            prev, cur = cur, nxt
        return prev
