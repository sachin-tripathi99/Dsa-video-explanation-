class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        nodes = []
        while head:
            nodes.append(head)
            head = head.next
        for i in range(0, len(nodes) - 1, 2):
            nodes[i], nodes[i + 1] = nodes[i + 1], nodes[i]
        dummy = p = ListNode(0)
        for x in nodes:
            p.next = x
            p = x
        p.next = None
        return dummy.next
