class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        vals = []
        for node in lists:
            while node:
                vals.append(node.val)
                node = node.next
        dummy = tail = ListNode(0)
        for x in sorted(vals):
            tail.next = ListNode(x)
            tail = tail.next
        return dummy.next
