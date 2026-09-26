class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        new_head = self.reverseList(head.next)  # reverse the rest
        head.next.next = head                   # attach head at its end
        head.next = None
        return new_head
