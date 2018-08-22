from algorithms.lib.Graphs import Graph
import sys
'''
This script reads two graphs from the data directory and then runs a randomized
algorithm to compute an isomorphism.

The graph file is simply a list of edges, with each edge being on a new line
and the ends separated by a space.
'''


if __name__ == '__main__':
  E_1 =[tuple(e.split()) for e in sys.argv[1].split(',')]
  E_2 =[tuple(e.split()) for e in sys.argv[2].split(',')]
  G_1, G_2 = Graph(), Graph()
  G_1.add_edges(map(E_1, lambda e: tuple(e.split())))
  G_2.add_edges(map(E_2, lambda e: tuple(e.split())))
  mapping = Graph.compute_isomorphism(G_1, G_2)
  if mapping is None:
   print 'Unable to find an isomorphism.'
  else:
   print 'Found isomorphism:'
   print mapping
