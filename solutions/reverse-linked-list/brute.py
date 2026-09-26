class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        stack = []
        p = head
        while p:
            stack.append(p.val)
            p = p.next
        p = head
        while p:
            p.val = stack.pop()
            p = p.next
        return head
