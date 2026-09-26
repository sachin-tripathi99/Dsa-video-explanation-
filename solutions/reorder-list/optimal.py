class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        slow = fast = head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next
        second, slow.next = slow.next, None     # 1. split after the middle
        prev = None
        while second:                           # 2. reverse the second half
            second.next, prev, second = prev, second, second.next
        a, b = head, prev
        while b:                                # 3. weave
            an, bn = a.next, b.next
            a.next = b
            b.next = an
            a, b = an, bn
