class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        def to_int(node):
            x, p = 0, 1
            while node:
                x += node.val * p
                p *= 10
                node = node.next
            return x

        s = to_int(l1) + to_int(l2)          # fine in Python (big ints), overflows in Java/C++
        dummy = tail = ListNode()
        while True:
            tail.next = ListNode(s % 10)
            tail = tail.next
            s //= 10
            if s == 0:
                break
        return dummy.next
