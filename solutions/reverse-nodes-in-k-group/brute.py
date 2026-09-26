class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        p = head
        while p:
            group, q = [], p
            while q and len(group) < k:
                group.append(q)
                q = q.next
            if len(group) < k:
                break
            vals = [x.val for x in group][::-1]     # write values back reversed
            for node, v in zip(group, vals):
                node.val = v
            p = q
        return head
