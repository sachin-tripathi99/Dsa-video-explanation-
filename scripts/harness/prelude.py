import json, math, sys, signal, traceback, collections, heapq, bisect, itertools, functools, string, re, random, operator
from typing import *
from collections import *
from heapq import *
from bisect import *
from itertools import *
from functools import *
from math import *

sys.setrecursionlimit(1_000_000)
inf = float('inf')


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class H:
    last_nodes = []

    @staticmethod
    def list(vals):
        dummy = cur = ListNode(0)
        H.last_nodes = []
        for v in vals:
            cur.next = ListNode(v)
            cur = cur.next
            H.last_nodes.append(cur)
        return dummy.next

    @staticmethod
    def cycle(vals, pos):
        head = H.list(vals)
        if pos >= 0 and H.last_nodes:
            H.last_nodes[-1].next = H.last_nodes[pos]
        return head

    @staticmethod
    def index_of(node):
        if node is None:
            return -1
        for i, n in enumerate(H.last_nodes):
            if n is node:
                return i
        return -2

    @staticmethod
    def tree(vals):
        if not vals or vals[0] is None:
            return None
        root = TreeNode(vals[0])
        q = collections.deque([root])
        i = 1
        while q and i < len(vals):
            cur = q.popleft()
            if i < len(vals) and vals[i] is not None:
                cur.left = TreeNode(vals[i])
                q.append(cur.left)
            i += 1
            if i < len(vals) and vals[i] is not None:
                cur.right = TreeNode(vals[i])
                q.append(cur.right)
            i += 1
        return root

    @staticmethod
    def find(root, val):
        if root is None:
            return None
        if root.val == val:
            return root
        return H.find(root.left, val) or H.find(root.right, val)

    @staticmethod
    def plain(o):
        if isinstance(o, ListNode):
            out, g = [], 0
            while o is not None and g < 100000:
                out.append(o.val)
                o = o.next
                g += 1
            return out
        if isinstance(o, TreeNode):
            out, order, i = [], [o], 0
            while i < len(order):
                t = order[i]
                i += 1
                if t is None:
                    out.append(None)
                    continue
                out.append(t.val)
                order.append(t.left)
                order.append(t.right)
            while out and out[-1] is None:
                out.pop()
            return out
        if isinstance(o, float) and (math.isnan(o) or math.isinf(o)):
            return None
        if isinstance(o, (list, tuple, set, frozenset)):
            return [H.plain(x) for x in o]
        if isinstance(o, dict):
            return {str(k): H.plain(v) for k, v in o.items()}
        return o

    @staticmethod
    def ser(o):
        return json.dumps(H.plain(o), separators=(',', ':'))


class _Timeout(Exception):
    pass


def _alarm(signum, frame):
    raise _Timeout('timed out')


signal.signal(signal.SIGALRM, _alarm)


def _emit(sid, t, payload):
    print(f"@@{sid}\t{t}\t{payload}", flush=True)


def _run(sid, code, tests):
    ns = {k: v for k, v in globals().items() if not k.startswith('_run')}
    try:
        exec(compile(code, sid, 'exec'), ns)
    except Exception as e:
        _emit(sid, -1, 'ERR\t' + type(e).__name__ + ': ' + str(e).replace('\n', ' '))
        return
    for ti, fn in enumerate(tests):
        signal.alarm(10)
        try:
            _emit(sid, ti, fn(ns))
        except Exception as e:
            tb = traceback.format_exc().strip().splitlines()[-1]
            _emit(sid, ti, 'ERR\t' + tb.replace('\t', ' '))
        finally:
            signal.alarm(0)
