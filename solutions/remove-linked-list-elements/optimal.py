class Solution:
    def removeElements(self, head: Optional[ListNode], val: int) -> Optional[ListNode]:
        dummy = prev = ListNode(0, head)
        while prev.next:
            if prev.next.val == val:
                prev.next = prev.next.next    # unlink
            else:
                prev = prev.next
        return dummy.next
