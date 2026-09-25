class Solution:
    def deleteDuplicates(self, head: Optional[ListNode]) -> Optional[ListNode]:
        seen = set()
        dummy = tail = ListNode()
        while head:
            if head.val not in seen:
                seen.add(head.val)
                tail.next = ListNode(head.val)
                tail = tail.next
            head = head.next
        return dummy.next
