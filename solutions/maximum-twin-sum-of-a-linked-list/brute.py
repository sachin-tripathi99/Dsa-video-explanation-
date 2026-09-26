class Solution:
    def pairSum(self, head: Optional[ListNode]) -> int:
        vals = []
        while head:
            vals.append(head.val)
            head = head.next
        n = len(vals)
        return max(vals[i] + vals[n - 1 - i] for i in range(n // 2))
