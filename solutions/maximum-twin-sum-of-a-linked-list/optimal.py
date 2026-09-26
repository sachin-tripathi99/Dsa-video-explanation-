class Solution:
    def pairSum(self, head: Optional[ListNode]) -> int:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        prev = None                             # reverse the second half
        while slow:
            slow.next, prev, slow = prev, slow, slow.next
        best = 0
        a, b = head, prev
        while b:
            best = max(best, a.val + b.val)
            a, b = a.next, b.next
        return best
