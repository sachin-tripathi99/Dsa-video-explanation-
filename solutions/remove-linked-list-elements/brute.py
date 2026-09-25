class Solution:
    def removeElements(self, head: Optional[ListNode], val: int) -> Optional[ListNode]:
        dummy = tail = ListNode()
        while head:
            if head.val != val:
                tail.next = ListNode(head.val)
                tail = tail.next
            head = head.next
        return dummy.next
