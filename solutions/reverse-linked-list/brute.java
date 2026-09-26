class Solution {
    public ListNode reverseList(ListNode head) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (ListNode p = head; p != null; p = p.next) stack.push(p.val);
        for (ListNode p = head; p != null; p = p.next) p.val = stack.pop();
        return head;
    }
}
