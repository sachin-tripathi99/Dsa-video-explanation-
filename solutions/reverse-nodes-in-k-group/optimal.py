class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        group_prev = dummy
        while True:
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next           # fewer than k left
            after, first = kth.next, group_prev.next
            prev, cur = after, first
            while cur is not after:             # reverse the group
                nxt = cur.next
                cur.next = prev
                prev, cur = cur, nxt
            group_prev.next = kth               # kth is the new front
            group_prev = first                  # old front is now the back
