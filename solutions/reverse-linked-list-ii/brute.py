class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        vals = []
        p = head
        while p:
            vals.append(p.val)
            p = p.next
        vals[left - 1:right] = vals[left - 1:right][::-1]
        p = head
        for x in vals:
            p.val = x
            p = p.next
        return head
