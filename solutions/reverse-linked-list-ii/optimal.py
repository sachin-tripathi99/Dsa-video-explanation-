class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        before = dummy
        for _ in range(left - 1):
            before = before.next
        after = before.next
        for _ in range(right - left + 1):       # node after the piece
            after = after.next
        prev, cur = after, before.next
        for _ in range(right - left + 1):       # reverse the piece
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt
        before.next = prev                      # reconnect the front
        return dummy.next
